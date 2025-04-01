import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Generates and downloads an Excel file with the provided data
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
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  saveAs(data, `${filename}.xlsx`);
}

/**
 * Returns the complete field schema grouped by categories
 */
function getEmployeeFieldsByCategory() {
  // (This function is assumed to already exist with full category-field mappings)
  // For brevity, not repeated here. Use the same version as previously pasted in full.
}

/**
 * Generates and downloads a fully horizontal employee Excel template
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const categoryOrder = [
    'personal', 'address', 'emergency', 'employment', 'probation', 'contract',
    'compensation', 'benefits', 'compliance', 'attendance', 'exit', 'others'
  ];

  const headers: string[] = [];
  const exampleRow: string[] = [];
  const emptyRow: string[] = [];

  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category];
    if (fields) {
      fields.forEach(field => {
        headers.push(field.label);
        exampleRow.push(field.example || '');
        emptyRow.push('');
      });
    }
  });

  const instructionsData = [
    ['Field Label', 'Field Name', 'Description', 'Example', 'Type', 'Required', 'Category']
  ];

  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category];
    if (fields) {
      fields.forEach(field => {
        instructionsData.push([
          field.label,
          field.field,
          field.description,
          field.example,
          field.type,
          field.required ? 'Yes' : 'No',
          category.charAt(0).toUpperCase() + category.slice(1)
        ]);
      });
    }
  });

  generateExcel("employee_template", [
    { name: 'Instructions', data: instructionsData },
    { name: 'Template', data: [headers, exampleRow, emptyRow] }
  ]);

  return true;
}
