import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';
import { getEmployeeFieldsByCategory } from './employeeFieldUtils';

export function generateExcel(
  filename: string,
  sheets: {
    name: string,
    data: any[][]
  }[]
) {
  const wb = XLSX.utils.book_new();

  sheets.forEach(sheet => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

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
  const fieldGroups = getEmployeeFieldsByCategory();
  const allFields = fieldGroups.flatMap(group => {
    return group.fields.map(field => ({
      label: field.label,
      name: field.name,
      description: field.description || '',
      example: field.example || '',
      type: field.type || 'Text',
      required: field.required ? 'Yes' : 'No',
      category: group.category
    }));
  });

  const sheetData: any[][] = [];

  // Desired row order: Required (1st), Field Label, Category, Example (last)
  const maxLength = allFields.length;
  for (let i = 0; i < maxLength; i++) {
    const field = allFields[i];
    sheetData[0] = sheetData[0] || [];
    sheetData[1] = sheetData[1] || [];
    sheetData[2] = sheetData[2] || [];
    sheetData[3] = sheetData[3] || [];

    sheetData[0].push(field.required); // First row: Required
    sheetData[1].push(field.label);    // Second row: Field Label
    sheetData[2].push(field.category); // Third row: Category
    sheetData[3].push(field.example);  // Fourth row: Example (last)
  }

  generateExcel('employee_template', [
    {
      name: 'Template',
      data: sheetData
    }
  ]);

  return true;
}
