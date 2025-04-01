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
 * Export all employee data to Excel including all fields
 */
export function exportEmployeesToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) return false;

  const fieldsByCategory = getEmployeeFieldsByCategory();
  const categoryOrder = Object.keys(fieldsByCategory);

  const allFields: any[] = [];
  categoryOrder.forEach((category) => {
    fieldsByCategory[category].forEach((field) => {
      allFields.push(field);
    });
  });

  const headers = allFields.map((field) => field.label);
  const data = employees.map((emp) =>
    allFields.map((field) => {
      const value = emp[field.field as keyof Employee];
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return value;
    })
  );

  generateExcel('employees_export', [
    {
      name: 'Employees',
      data: [headers, ...data],
    },
  ]);
  return true;
}

/**
 * Get all employee fields organized by category
 */
export function getEmployeeFieldsByCategory() {
  // This should be a full field map, for brevity only partial shown
  return {
    personal: [
      { field: 'full_name', label: 'Full Name', example: 'Tan Wei Ming' },
      { field: 'email', label: 'Email', example: 'tanwm@example.com' },
      { field: 'date_of_birth', label: 'Date of Birth', example: '1990-01-15' },
      { field: 'gender', label: 'Gender', example: 'Male' },
    ],
    employment: [
      { field: 'job_title', label: 'Job Title', example: 'Engineer' },
      { field: 'department', label: 'Department', example: 'IT' },
      { field: 'employment_status', label: 'Employment Status', example: 'Active' },
      { field: 'date_of_hire', label: 'Date of Hire', example: '2022-01-01' },
    ],
    compensation: [
      { field: 'salary', label: 'Salary', example: '5000' },
      { field: 'bank_name', label: 'Bank Name', example: 'DBS' },
      { field: 'bank_account_number', label: 'Bank Account Number', example: '123456789' },
      { field: 'cpf_contribution', label: 'CPF Contribution', example: 'true' },
      { field: 'tax_identification_number', label: 'Tax ID Number', example: 'S1234567D' },
    ],
  };
}
