import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';
import { getEmployeeFieldsByCategory } from '@/utils/employeeFieldUtils'; // Adjust if needed

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
  const fieldGroups = getEmployeeFieldsByCategory(); // returns { category: string, fields: FieldMeta[] }

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

  const fieldLabels = allFields.map(field => field.label);
  const fieldNames = allFields.map(field => field.name);
  const descriptions = allFields.map(field => field.description);
  const examples = allFields.map(field => field.example);
  const types = allFields.map(field => field.type);
  const required = allFields.map(field => field.required);
  const categories = allFields.map(field => field.category);

  const sheetData = [
    fieldLabels,
    fieldNames,
    descriptions,
    examples,
    types,
    required,
    categories
  ];

  generateExcel('employee_template', [
    {
      name: 'Template',
      data: sheetData
    }
  ]);

  return true;
}
