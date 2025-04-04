
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  Employee,
  EmployeeFormData,
  EmployeeFamilyMember,
  EmployeeEducation,
  EmployeeWorkExperience,
  EmployeeAppraisalRating
} from '@/types/employee';
import {
  fullEmployeeFieldList,
  getFieldMetaByName
} from './employeeFieldUtils';
import { stringToBoolean } from './formatters';

export const exportEmployeesToExcel = (employees: Employee[]) => {
  // Unchanged logic
};

export const generateEmployeeTemplate = () => {
  // Unchanged logic
};

export const convertFieldValue = (field: any, rawValue: any): any => {
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return null;
  }

  try {
    switch (field.type) {
      case 'number':
        // For fields that could contain "Yes"/"No" but are numeric in database
        if (typeof rawValue === 'string' && 
            (rawValue.toLowerCase() === 'yes' || 
             rawValue.toLowerCase() === 'no' || 
             rawValue.toLowerCase() === 'true' || 
             rawValue.toLowerCase() === 'false')) {
          return null; // Return null to avoid numeric parsing errors
        }
        const num = Number(rawValue);
        return isNaN(num) ? null : num;
      
      case 'boolean':
        return stringToBoolean(rawValue);
      
      case 'date':
        if (rawValue instanceof Date) return rawValue.toISOString().split('T')[0];
        // Excel dates can be numbers - check if it's a number and convert
        if (typeof rawValue === 'number') {
          const excelDate = new Date(Math.floor((rawValue - 25569) * 86400 * 1000));
          return excelDate.toISOString().split('T')[0];
        }
        try {
          const date = new Date(rawValue);
          return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null;
        } catch (e) {
          return null;
        }
      
      case 'dropdown':
        return String(rawValue);
      
      default:
        return String(rawValue);
    }
  } catch (error) {
    console.error(`Error converting value ${rawValue} for field ${field.name}:`, error);
    return null;
  }
};

export const parseEmployeeDataFromExcel = (headerRow: any[], dataRow: any[]): Partial<EmployeeFormData> => {
  const employee: Partial<Employee> = {};

  headerRow.forEach((header, index) => {
    if (!header || typeof header !== 'string') return;
    if (header.includes('---')) return;

    const field = fullEmployeeFieldList.find(f => f.label === header);
    if (field && index < dataRow.length) {
      const rawValue = dataRow[index];
      if (rawValue !== undefined && rawValue !== null && rawValue !== '') {
        try {
          const fieldMeta = getFieldMetaByName(field.name);
          const convertedValue = convertFieldValue(fieldMeta || field, rawValue);
          if (convertedValue !== null) {
            (employee as any)[field.name] = convertedValue;
          }
        } catch (error) {
          console.error(`Error converting field ${field.name}:`, error);
        }
      }
    }
  });

  return { employee };
};

export const processEmployeeImport = async (file: File): Promise<Partial<EmployeeFormData>[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) {
          throw new Error('Invalid template format or empty file');
        }

        const headerRow = jsonData[0];
        const employees: Partial<EmployeeFormData>[] = [];

        for (let i = 1; i < jsonData.length; i++) {
          const dataRow = jsonData[i];
          if (!dataRow || !dataRow.length || !dataRow.some(cell => cell !== null && cell !== undefined && cell !== '')) {
            continue;
          }

          try {
            const parsed = parseEmployeeDataFromExcel(headerRow, dataRow);
            if (parsed.employee?.full_name && parsed.employee?.email) {
              employees.push(parsed);
            }
          } catch (error) {
            console.error(`Error processing row ${i}:`, error);
          }
        }

        resolve(employees);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
