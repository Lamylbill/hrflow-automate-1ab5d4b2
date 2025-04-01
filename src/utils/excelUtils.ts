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
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  saveAs(data, `${filename}.xlsx`);
}

export function exportEmployeesToExcel(employees: Employee[]) {
  if (!employees || employees.length === 0) return false;

  const allFields = new Set<string>();
  employees.forEach(emp => {
    Object.keys(emp).forEach(key => {
      if (key !== 'id' && key !== 'user_id') {
        allFields.add(key);
      }
    });
  });

  const headers = Array.from(allFields).map(field =>
    field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  );

  const data = employees.map(emp => {
    return Array.from(allFields).map(field => {
      const val = emp[field as keyof Employee];
      if (val === null || val === undefined) return '';
      if (Array.isArray(val)) return val.join(', ');
      if (typeof val === 'boolean') return val ? 'Yes' : 'No';
      return val;
    });
  });

  generateExcel('employees_export', [
    {
      name: 'Employees',
      data: [headers, ...data]
    }
  ]);
  return true;
}

function getEmployeeFieldsByCategory() {
  return {
    personal: [
      { field: 'full_name', label: 'Full Name', example: 'Tan Wei Ming' },
      { field: 'email', label: 'Email', example: 'wei.ming@example.com.sg' },
      { field: 'date_of_birth', label: 'Date of Birth', example: '1990-01-15' },
      { field: 'gender', label: 'Gender', example: 'Male' }
    ],
    employment: [
      { field: 'job_title', label: 'Job Title', example: 'Software Engineer' },
      { field: 'department', label: 'Department', example: 'IT' },
      { field: 'employment_status', label: 'Employment Status', example: 'Active' },
      { field: 'date_of_hire', label: 'Date of Hire', example: '2022-01-15' }
    ],
    compensation: [
      { field: 'salary', label: 'Salary', example: '5000' },
      { field: 'bank_name', label: 'Bank Name', example: 'DBS' },
      { field: 'bank_account_number', label: 'Bank Account Number', example: '123456789' }
    ],
    compliance: [
      { field: 'cpf_contribution', label: 'CPF Contribution', example: 'true' },
      { field: 'tax_identification_number', label: 'Tax ID Number', example: 'S9812345A' }
    ]
  };
}

export function generateEmployeeTemplate() {
  const fieldsByCategory = getEmployeeFieldsByCategory();
  const categoryOrder = ['personal', 'employment', 'compensation', 'compliance'];

  const headers: string[] = [];
  const examples: string[] = [];
  const empty: string[] = [];

  categoryOrder.forEach(category => {
    fieldsByCategory[category].forEach(field => {
      headers.push(field.label);
      examples.push(field.example || '');
      empty.push('');
    });
  });

  generateExcel('employee_template', [
    {
      name: 'Template',
      data: [headers, examples, empty]
    }
  ]);
}
