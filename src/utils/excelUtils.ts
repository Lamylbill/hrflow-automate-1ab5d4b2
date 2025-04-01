import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Gets the full list of employee fields, organized by category.
 * You must update this function whenever the schema changes.
 */
function getEmployeeFieldsByCategory() {
  return {
    personal: [
      { field: 'full_name', label: 'Full Name', example: 'Tan Wei Ming' },
      { field: 'email', label: 'Email', example: 'wei.ming@example.com.sg' },
      { field: 'date_of_birth', label: 'Date of Birth', example: '1990-01-15' },
      { field: 'gender', label: 'Gender', example: 'Male' },
      { field: 'phone_number', label: 'Phone Number', example: '+6591234567' },
      { field: 'nationality', label: 'Nationality', example: 'Singapore' },
      { field: 'identity_no', label: 'Identity Number', example: 'S1234567D' },
      { field: 'marital_status', label: 'Marital Status', example: 'Single' },
      { field: 'birth_place', label: 'Birth Place', example: 'Singapore' },
    ],
    employment: [
      { field: 'job_title', label: 'Job Title', example: 'Software Engineer' },
      { field: 'department', label: 'Department', example: 'Engineering' },
      { field: 'employment_status', label: 'Employment Status', example: 'Active' },
      { field: 'employment_type', label: 'Employment Type', example: 'Full-time' },
      { field: 'date_of_hire', label: 'Date of Hire', example: '2023-01-01' },
      { field: 'date_of_exit', label: 'Date of Exit', example: '2024-01-01' },
      { field: 'reporting_manager', label: 'Reporting Manager', example: 'John Lee' },
    ],
    contract: [
      { field: 'contract_signed', label: 'Contract Signed', example: 'true' },
      { field: 'contract_date_start', label: 'Contract Start Date', example: '2023-01-01' },
      { field: 'contract_date_end', label: 'Contract End Date', example: '2025-01-01' },
    ],
    compensation: [
      { field: 'salary', label: 'Salary', example: '5000' },
      { field: 'bank_name', label: 'Bank Name', example: 'DBS Bank' },
      { field: 'bank_account_number', label: 'Bank Account Number', example: '123456789' },
      { field: 'cpf_contribution', label: 'CPF Contribution', example: 'true' },
      { field: 'cpf_account_number', label: 'CPF Account Number', example: 'S1234567D' },
      { field: 'tax_identification_number', label: 'Tax ID Number', example: 'S1234567D' },
    ],
    benefits: [
      { field: 'leave_entitlement', label: 'Leave Entitlement', example: '14' },
      { field: 'leave_balance', label: 'Leave Balance', example: '10' },
      { field: 'medical_entitlement', label: 'Medical Entitlement', example: '14' },
    ],
    others: [
      { field: 'notes', label: 'Notes', example: 'Excellent performer' },
    ],
  };
}

/**
 * Generates and downloads the dynamic employee import Excel template
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const categoryOrder = ['personal', 'employment', 'contract', 'compensation', 'benefits', 'others'];

  const headerRow: string[] = [];
  const exampleRow: string[] = [];

  categoryOrder.forEach(category => {
    fieldsByCategory[category]?.forEach(field => {
      headerRow.push(field.label);
      exampleRow.push(field.example);
    });
  });

  const emptyRow = Array(headerRow.length).fill('');

  const instructionSheet = [
    ['Field Label', 'Field Name', 'Example', 'Category']
  ];
  categoryOrder.forEach(category => {
    fieldsByCategory[category]?.forEach(field => {
      instructionSheet.push([
        field.label,
        field.field,
        field.example,
        category
      ]);
    });
  });

  const wb = XLSX.utils.book_new();
  const templateWS = XLSX.utils.aoa_to_sheet([headerRow, exampleRow, emptyRow]);
  const instructionsWS = XLSX.utils.aoa_to_sheet(instructionSheet);

  XLSX.utils.book_append_sheet(wb, templateWS, 'Template');
  XLSX.utils.book_append_sheet(wb, instructionsWS, 'Instructions');

  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'employee_template.xlsx');
}
