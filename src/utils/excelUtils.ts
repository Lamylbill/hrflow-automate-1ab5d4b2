import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Employee } from '@/types/employee';

interface SheetData {
  name: string;
  data: any[][];
}

/**
 * Generates and downloads an Excel file with the provided data
 */
export function generateExcel(filename: string, sheets: SheetData[]) {
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
 * Export all employee data to Excel including all fields
 */
export function exportEmployeesToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) return false;

  const headers = Object.keys(employees[0]).filter(k => k !== 'id' && k !== 'user_id');
  const data = employees.map(emp => headers.map(h => emp[h as keyof Employee] ?? ''));
  const readableHeaders = headers.map(h => h.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
  generateExcel('employees_export', [
    { name: 'Employees', data: [readableHeaders, ...data] }
  ]);
  return true;
}

/**
 * Generates and downloads a template Excel file for importing employee data
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const categoryOrder = [
    'personal', 'address', 'emergency', 'employment', 'probation', 'contract',
    'compensation', 'benefits', 'compliance', 'attendance', 'exit', 'others'
  ];

  const headerRow: string[] = [];
  const exampleRow: string[] = [];

  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category] || [];
    fields.forEach(field => {
      headerRow.push(field.label);
      exampleRow.push(field.example || '');
    });
  });

  const emptyRow = Array(headerRow.length).fill('');
  const templateSheet = [headerRow, exampleRow, emptyRow];

  const instructionsSheet = [
    ['Field Label', 'Field Name', 'Description', 'Example', 'Type', 'Required', 'Category']
  ];
  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category] || [];
    fields.forEach(field => {
      instructionsSheet.push([
        field.label,
        field.field,
        field.description,
        field.example,
        field.type,
        field.required ? 'Yes' : 'No',
        category
      ]);
    });
  });

  generateExcel('employee_template', [
    { name: 'Instructions', data: instructionsSheet },
    { name: 'Template', data: templateSheet }
  ]);
}

/**
 * Placeholder: Populate this with your actual grouped schema
 */
function getEmployeeFieldsByCategory(): Record<string, any[]> {
  return {
    personal: [
      { field: 'full_name', label: 'Full Name', description: 'Employee full name', example: 'Tan Wei Ming', type: 'Text', required: true },
      { field: 'email', label: 'Email', description: 'Employee email', example: 'wei@example.com', type: 'Email', required: true },
      { field: 'date_of_birth', label: 'Date of Birth', description: 'DOB', example: '1990-01-01', type: 'Date', required: false },
    ],
    employment: [
      { field: 'job_title', label: 'Job Title', description: 'Job designation', example: 'Software Engineer', type: 'Text', required: true },
      { field: 'date_of_hire', label: 'Date of Hire', description: 'Joining date', example: '2020-06-01', type: 'Date', required: true }
    ],
    // Add the remaining categories: address, emergency, etc.
  };
}
