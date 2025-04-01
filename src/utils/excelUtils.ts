import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface FieldDefinition {
  field: string;
  label: string;
  description: string;
  example: string;
  type: string;
  required: boolean;
  category: string;
}

/**
 * Generates and downloads an Excel file with the provided data
 */
function generateExcel(
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
 * Template data source from latest field schema grouped by category
 */
function getEmployeeFieldsByCategory(): Record<string, FieldDefinition[]> {
  // Inject the full field definition set from your previous field config (as seen in your schema).
  // This code assumes you've already generated and validated this function to return all your fields.
  return {/* full schema */}; // <-- Replace this with your full schema object
}

/**
 * Generates and downloads a fully structured employee template with correct orientation
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const allFields: FieldDefinition[] = [];

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

  categoryOrder.forEach((category) => {
    if (fieldsByCategory[category]) {
      fieldsByCategory[category].forEach((field) => {
        allFields.push({ ...field, category });
      });
    }
  });

  // Build vertically oriented instructions sheet (each row = 1 field)
  const instructionsData: any[][] = [
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

  allFields.forEach((f) => {
    instructionsData.push([
      f.label,
      f.field,
      f.description,
      f.example,
      f.type,
      f.required ? 'Yes' : 'No',
      f.category.charAt(0).toUpperCase() + f.category.slice(1),
    ]);
  });

  // Build horizontally oriented template sheet (each field is a column)
  const templateHeaderRow: string[] = allFields.map((f) => f.label);
  const exampleRow: string[] = allFields.map((f) => f.example);
  const emptyRow: string[] = allFields.map(() => '');

  generateExcel('employee_template', [
    { name: 'Instructions', data: instructionsData },
    { name: 'Template', data: [templateHeaderRow, exampleRow, emptyRow] },
  ]);
}
