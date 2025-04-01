import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

/**
 * Generates and downloads an Excel file
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
 * Defines the full schema of employee fields
 */
export function getEmployeeFieldsByCategory() {
  return {
    personal: [
      { field: 'full_name', label: 'Full Name', description: "Employee's full name", example: 'Tan Wei Ming', type: 'Text', required: true },
      { field: 'email', label: 'Email', description: "Employee's work email", example: 'wei.ming@example.com.sg', type: 'Email', required: true },
      { field: 'personal_email', label: 'Personal Email', description: 'Personal email address', example: 'weiming@gmail.com', type: 'Email', required: false },
      { field: 'mobile_no', label: 'Mobile Number', description: 'Employee mobile number', example: '+6591234567', type: 'Text', required: false },
      { field: 'telephone_no', label: 'Telephone Number', description: 'Fixed line number', example: '+6567890123', type: 'Text', required: false },
      { field: 'date_of_birth', label: 'Date of Birth', description: 'Birth date', example: '1990-01-15', type: 'Date', required: false },
      { field: 'gender', label: 'Gender', description: 'Gender identity', example: 'Male / Female / Other', type: 'Text', required: false },
      { field: 'nationality', label: 'Nationality', description: 'Citizenship', example: 'Singaporean', type: 'Text', required: false },
    ],
    employment: [
      { field: 'employee_code', label: 'Employee Code', description: 'Internal employee number', example: 'EMP001', type: 'Text', required: false },
      { field: 'job_title', label: 'Job Title', description: 'Position title', example: 'Software Engineer', type: 'Text', required: false },
      { field: 'department', label: 'Department', description: 'Department name', example: 'IT', type: 'Text', required: false },
      { field: 'employment_status', label: 'Employment Status', description: 'Active/Resigned/Leave', example: 'Active', type: 'Text', required: false },
      { field: 'employment_type', label: 'Employment Type', description: 'Full-time/Part-time/Contract', example: 'Full-time', type: 'Text', required: false },
      { field: 'date_of_hire', label: 'Date of Hire', description: 'Date of joining', example: '2022-01-15', type: 'Date', required: false },
    ],
    compensation: [
      { field: 'salary', label: 'Salary', description: 'Gross monthly salary', example: '5000', type: 'Number', required: false },
      { field: 'bank_name', label: 'Bank Name', description: 'Salary credit bank', example: 'DBS', type: 'Text', required: false },
      { field: 'bank_account_number', label: 'Bank Account Number', description: 'Account number for salary', example: '123456789', type: 'Text', required: false },
      { field: 'cpf_contribution', label: 'CPF Contribution', description: 'CPF eligible', example: 'true', type: 'Boolean', required: false },
      { field: 'tax_identification_number', label: 'Tax ID Number', description: 'NRIC/FIN for tax reporting', example: 'S9812345A', type: 'Text', required: false },
    ],
  };
}

/**
 * Generate Employee Excel Template
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();

  const headerRow: string[] = [];
  const exampleRow: string[] = [];

  const categoryOrder = ['personal', 'employment', 'compensation'];
  categoryOrder.forEach((category) => {
    if (fieldsByCategory[category]) {
      fieldsByCategory[category].forEach((field) => {
        headerRow.push(field.label);
        exampleRow.push(field.example || '');
      });
    }
  });

  const emptyRow = new Array(headerRow.length).fill('');

  const instructionsData = [
    ['Field Label', 'Field Name', 'Description', 'Example', 'Type', 'Required', 'Category'],
  ];

  categoryOrder.forEach((category) => {
    if (fieldsByCategory[category]) {
      fieldsByCategory[category].forEach((field) => {
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
    }
  });

  generateExcel('employee_template', [
    { name: 'Instructions', data: instructionsData },
    { name: 'Template', data: [headerRow, exampleRow, emptyRow] },
  ]);
}
