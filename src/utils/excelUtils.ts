import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';

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

export function generateEmployeeTemplate(fieldsByCategory: Record<string, any[]>) {
  const categoryOrder = ['personal', 'address', 'emergency', 'employment', 'probation', 'contract', 'compensation', 'benefits', 'compliance', 'attendance', 'exit', 'others'];

  const headers: string[] = [];
  const sampleValues: string[] = [];

  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category];
    if (fields) {
      fields.forEach(field => {
        headers.push(field.label);
        sampleValues.push(field.example || '');
      });
    }
  });

  const emptyRow = new Array(headers.length).fill('');

  const templateSheetData = [headers, sampleValues, emptyRow];

  const instructionsSheetData: any[][] = [
    ['Field Label', 'Field Name', 'Description', 'Example', 'Type', 'Required', 'Category']
  ];

  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category];
    if (fields) {
      fields.forEach(field => {
        instructionsSheetData.push([
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

  generateExcel('employee_template', [
    { name: 'Template', data: templateSheetData },
    { name: 'Instructions', data: instructionsSheetData }
  ]);
}
