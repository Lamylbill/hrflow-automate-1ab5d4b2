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

  // Ensure all fields from Employee type are included
  const fieldNamesSet = new Set(allFields.map(f => f.name));
  const employeeFieldNames = Object.keys({} as Employee).filter(
    key => key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at'
  );

  employeeFieldNames.forEach(name => {
    if (!fieldNamesSet.has(name)) {
      allFields.push({
        name,
        label: name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        type: 'Text',
        required: false,
        category: 'Other',
        example: ''
      });
    }
  });

  const requiredRow: string[] = [];
  const labelRow: string[] = [];
  const categoryRow: string[] = [];
  const exampleRow: string[] = [];

  allFields.forEach(field => {
    requiredRow.push(field.required);
    labelRow.push(field.label);
    categoryRow.push(field.category);
    exampleRow.push(field.example);
  });

  const sheetData = [requiredRow, labelRow, categoryRow, exampleRow];

  generateExcel('employee_template', [
    {
      name: 'Template',
      data: sheetData
    }
  ]);

  return true;
}
