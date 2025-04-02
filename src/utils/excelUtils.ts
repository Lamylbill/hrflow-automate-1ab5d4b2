
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { fullEmployeeFieldList } from './employeeFieldUtils';
import { Employee } from '@/types/employee';

export function generateExcel(
  filename: string,
  sheets: {
    name: string;
    data: any[][];
  }[]
) {
  const wb = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(data, `${filename}.xlsx`);
}

export function exportEmployeesToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) {
    return false;
  }

  const allFields = new Set<string>();
  employees.forEach(employee => {
    Object.keys(employee).forEach(key => {
      if (key !== 'id' && key !== 'user_id') {
        allFields.add(key);
      }
    });
  });

  const headers = Array.from(allFields).map(field =>
    field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );

  const data = employees.map(employee => {
    return Array.from(allFields).map(field => {
      const value = employee[field as keyof Employee];
      if (value === null || value === undefined) {
        return '';
      } else if (Array.isArray(value)) {
        return value.join(', ');
      } else if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
      } else {
        return value;
      }
    });
  });

  const exportData = [headers, ...data];
  generateExcel('employees_export', [{ name: 'Employees', data: exportData }]);
  return true;
}

export function generateEmployeeTemplate() {
  const allFields = fullEmployeeFieldList;

  const labelRow: string[] = [];
  const categoryRow: string[] = [];
  const requiredRow: string[] = [];
  const exampleRow: string[] = [];

  allFields.forEach(field => {
    labelRow.push(field.label);
    categoryRow.push(field.category || 'Other');
    requiredRow.push(field.required ? 'Yes' : 'No');
    exampleRow.push(field.example || '');
  });

  const sheetData = [labelRow, categoryRow, requiredRow, exampleRow];

  generateExcel('employee_template', [
    {
      name: 'Template',
      data: sheetData,
    },
  ]);

  return true;
}

export default {
  generateExcel,
  generateEmployeeTemplate,
  exportEmployeesToExcel,
};
