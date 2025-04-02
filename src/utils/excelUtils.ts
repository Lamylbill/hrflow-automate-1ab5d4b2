import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { fullEmployeeFieldList } from './employeeFieldUtils';

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
