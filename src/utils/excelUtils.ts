import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';

/**
 * Generates and downloads an Excel file with the provided data
 * @param filename The name of the file to download
 * @param sheets An array of sheet data objects
 */
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

/**
 * Get all employee fields organized by category
 */
function getEmployeeFieldsByCategory() {
  // You can paste your full `getEmployeeFieldsByCategory()` function here as it currently exists.
  // For brevity, we're assuming it's already implemented.
  return {}; // Replace with your actual implementation.
}

/**
 * Generates and downloads an employee template Excel file
 * with Singapore-specific example data organized by categories
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const headers: string[] = [];
  const exampleRow: string[] = [];

  const categoryOrder = [
    'personal', 'address', 'emergency', 'employment', 'probation', 'contract',
    'compensation', 'benefits', 'compliance', 'attendance', 'exit', 'others'
  ];

  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category];
    fields.forEach(field => {
      headers.push(field.label);
      exampleRow.push(field.example || '');
    });
  });

  const emptyRow = Array(headers.length).fill("");

  const instructionsData = [
    ["Field Label", "Field Name", "Description", "Example", "Type", "Required", "Category"]
  ];

  categoryOrder.forEach(category => {
    fieldsByCategory[category].forEach(field => {
      instructionsData.push([
        field.label,
        field.field,
        field.description,
        field.example,
        field.type,
        field.required ? "Yes" : "No",
        category.charAt(0).toUpperCase() + category.slice(1)
      ]);
    });
  });

  generateExcel("employee_template", [
    { name: "Instructions", data: instructionsData },
    { name: "Template", data: [headers, exampleRow, emptyRow] }
  ]);
}
