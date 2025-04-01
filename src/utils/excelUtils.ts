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
  const data = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(data, `${filename}.xlsx`);
}

export function generateEmployeeTemplate() {
  const fields: { label: string; example: string }[] = [
    { label: 'Full Name', example: 'Tan Wei Ming' },
    { label: 'Email', example: 'wei.ming@example.com.sg' },
    { label: 'Date of Birth', example: '1990-01-15' },
    { label: 'Gender', example: 'Male' },
    { label: 'Job Title', example: 'Software Engineer' },
    { label: 'Department', example: 'IT' },
    { label: 'Employment Status', example: 'Active' },
    { label: 'Date of Hire', example: '2022-01-15' },
    { label: 'Salary', example: '5000' },
    { label: 'Bank Name', example: 'DBS Bank' },
    { label: 'Bank Account Number', example: '123456789' },
    { label: 'CPF Contribution', example: 'true' },
    { label: 'Tax ID Number', example: 'S9812345A' },
    { label: 'Home Address', example: 'Block 123, Ang Mo Kio Ave 6' },
    { label: 'Postal Code', example: '560123' },
    { label: 'Emergency Contact Name', example: 'Lim Mei Ling' },
    { label: 'Emergency Contact Phone', example: '+6598765432' },
    { label: 'Leave Entitlement', example: '14' },
    { label: 'Leave Balance', example: '10' },
    { label: 'Medical Entitlement', example: '14' },
    { label: 'Nationality', example: 'Singapore' },
    { label: 'Employment Type', example: 'Full-time' },
    { label: 'Employment Code', example: 'EMP001' },
    { label: 'Identity No', example: 'S9812345A' },
    { label: 'Phone Number', example: '+6591234567' },
    { label: 'Contract Signed', example: 'true' },
    { label: 'Work Permit Number', example: 'G1234567K' },
    { label: 'Work Pass Expiry Date', example: '2025-01-15' },
    { label: 'CPF Account Number', example: 'S1234567D' },
  ];

  const headerRow = fields.map(field => field.label);
  const exampleRow = fields.map(field => field.example);
  const emptyRow = Array(fields.length).fill('');

  const data = [headerRow, exampleRow, emptyRow];

  generateExcel('employee_template', [{ name: 'Template', data }]);
}
