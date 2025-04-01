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
 * Generate a dynamic employee template with all fields in columns
 */
export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const categoryOrder = [
    'personal', 'address', 'emergency', 'employment', 'probation', 'contract',
    'compensation', 'benefits', 'compliance', 'attendance', 'exit', 'others'
  ];

  const headerRow: string[] = [];
  const exampleRow: string[] = [];
  const emptyRow: string[] = [];

  categoryOrder.forEach(category => {
    const fields = fieldsByCategory[category];
    if (fields) {
      fields.forEach(field => {
        headerRow.push(field.label);
        exampleRow.push(field.example || '');
        emptyRow.push('');
      });
    }
  });

  const instructionsData: any[][] = [[
    'Field Label', 'Field Name', 'Description', 'Example', 'Type', 'Required', 'Category'
  ]];

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
          category
        ]);
      });
    }
  });

  generateExcel('employee_template', [
    { name: 'Instructions', data: instructionsData },
    { name: 'Template', data: [headerRow, exampleRow, emptyRow] },
  ]);
}

/**
 * Export all employees to Excel with dynamic fields
 */
export function exportEmployeesToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) return false;

  const allFields = new Set<string>();
  employees.forEach(employee => {
    Object.keys(employee).forEach(key => {
      if (key !== 'id' && key !== 'user_id') allFields.add(key);
    });
  });

  const headers = Array.from(allFields).map(field =>
    field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  );

  const data = employees.map(emp => {
    return Array.from(allFields).map(field => {
      const value = emp[field as keyof Employee];
      if (value === null || value === undefined) return '';
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return value;
    });
  });

  generateExcel('employees_export', [
    { name: 'Employees', data: [headers, ...data] },
  ]);

  return true;
}

/**
 * Returns the full dynamic schema grouped by categories
 */
function getEmployeeFieldsByCategory() {
  // This function must be updated to match your full dynamic schema.
  // Right now, it returns a sample set for demonstration.
  return {
    personal: [
      { field: "full_name", label: "Full Name", description: "Employee's full name", example: "Tan Wei Ming", type: "Text", required: true },
      { field: "email", label: "Email", description: "Employee's work email", example: "wei.ming@example.com.sg", type: "Email", required: true },
      { field: "date_of_birth", label: "Date of Birth", description: "Birth date", example: "1990-01-15", type: "Date", required: false },
      { field: "gender", label: "Gender", description: "Gender", example: "Male", type: "Text", required: false }
    ],
    employment: [
      { field: "job_title", label: "Job Title", description: "Job role", example: "Software Engineer", type: "Text", required: false },
      { field: "department", label: "Department", description: "Department", example: "IT", type: "Text", required: false },
      { field: "employment_status", label: "Employment Status", description: "Status", example: "Active", type: "Text", required: false },
      { field: "date_of_hire", label: "Date of Hire", description: "Hire date", example: "2022-01-15", type: "Date", required: false }
    ],
    compensation: [
      { field: "salary", label: "Salary", description: "Monthly salary", example: "5000", type: "Number", required: false },
      { field: "bank_name", label: "Bank Name", description: "Bank name", example: "DBS", type: "Text", required: false },
      { field: "bank_account_number", label: "Bank Account Number", description: "Bank account", example: "123456789", type: "Text", required: false },
      { field: "cpf_contribution", label: "CPF Contribution", description: "CPF", example: "true", type: "Boolean", required: false },
      { field: "tax_identification_number", label: "Tax ID Number", description: "Tax ID", example: "S9812345A", type: "Text", required: false }
    ]
  };
}
