import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';

/**
 * Generates and downloads an Excel file with the provided data
 */
export function generateExcel(
  filename: string,
  sheets: {
    name: string;
    data: any[][];
  }[]
) {
  const wb = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const ws = XLSX.utils.aoa_to_sheet(sheet.data);
    XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  });

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(data, `${filename}.xlsx`);
}

/**
 * Generates and downloads an employee template Excel file
 * with Singapore-specific example data organized by categories
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const categoryOrder = [
    'personal',
    'address',
    'emergency',
    'employment',
    'probation',
    'contract',
    'compensation',
    'benefits',
    'compliance',
    'attendance',
    'exit',
    'others',
  ];

  const headerRow: string[] = [];
  const exampleRow: string[] = [];
  const emptyRow: string[] = [];

  categoryOrder.forEach((category) => {
    const fields = fieldsByCategory[category] || [];
    fields.forEach((field) => {
      headerRow.push(field.label);
      exampleRow.push(field.example || '');
      emptyRow.push('');
    });
  });

  const instructionsData = [
    [
      'Field Label',
      'Field Name',
      'Description',
      'Example',
      'Type',
      'Required',
      'Category',
    ],
  ];

  categoryOrder.forEach((category) => {
    const fields = fieldsByCategory[category] || [];
    fields.forEach((field) => {
      instructionsData.push([
        field.label,
        field.field,
        field.description,
        field.example,
        field.type,
        field.required ? 'Yes' : 'No',
        category.charAt(0).toUpperCase() + category.slice(1),
      ]);
    });
  });

  generateExcel('employee_template', [
    { name: 'Instructions', data: instructionsData },
    { name: 'Template', data: [headerRow, exampleRow, emptyRow] },
  ]);

  return true;
}

/**
 * Placeholder - You must define this function to return the actual field metadata.
 */
function getEmployeeFieldsByCategory(): Record<string, {
  field: string;
  label: string;
  description: string;
  example: string;
  type: string;
  required: boolean;
}[]> {
  // This should be replaced by your actual schema config.
  return {
    personal: [
      {
        field: 'full_name',
        label: 'Full Name',
        description: "Employee's full name",
        example: 'Tan Wei Ming',
        type: 'Text',
        required: true,
      },
      // ... include all other fields here
    ],
    // ... other categories follow
  };
}
