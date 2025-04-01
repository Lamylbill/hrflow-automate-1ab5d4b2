export interface FieldMeta {
  name: string;
  label: string;
  type: string;
  required: boolean;
  example?: string;
  description?: string;
}

export interface FieldCategory {
  category: string;
  fields: FieldMeta[];
}

export function getEmployeeFieldsByCategory(): FieldCategory[] {
  return [
    {
      category: 'Personal',
      fields: [
        { name: 'full_name', label: 'Full Name', type: 'Text', required: true, example: 'Tan Wei Ming' },
        { name: 'first_name', label: 'First Name', type: 'Text', required: false },
        { name: 'last_name', label: 'Last Name', type: 'Text', required: false },
        { name: 'date_of_birth', label: 'Date of Birth', type: 'Date', required: false },
        { name: 'gender', label: 'Gender', type: 'Text', required: false },
        { name: 'nationality', label: 'Nationality', type: 'Text', required: false },
        { name: 'marital_status', label: 'Marital Status', type: 'Text', required: false },
        { name: 'identity_no', label: 'NRIC / FIN', type: 'Text', required: false },
        { name: 'email', label: 'Email', type: 'Email', required: true },
        { name: 'phone_number', label: 'Phone Number', type: 'Text', required: false }
      ]
    },
    {
      category: 'Employment',
      fields: [
        { name: 'job_title', label: 'Job Title', type: 'Text', required: false },
        { name: 'department', label: 'Department', type: 'Text', required: false },
        { name: 'employment_status', label: 'Employment Status', type: 'Text', required: false },
        { name: 'date_of_hire', label: 'Date of Hire', type: 'Date', required: false },
        { name: 'manager', label: 'Manager', type: 'Text', required: false },
        { name: 'mobile_no', label: 'Mobile Number', type: 'Text', required: false },
        { name: 'personal_email', label: 'Personal Email', type: 'Email', required: false }
      ]
    },
    {
      category: 'Contract & Lifecycle',
      fields: [
        { name: 'contract_date_start', label: 'Contract Start Date', type: 'Date', required: false },
        { name: 'contract_date_end', label: 'Contract End Date', type: 'Date', required: false },
        { name: 'contract_type', label: 'Contract Type', type: 'Text', required: false },
        { name: 'rehire', label: 'Rehire Status', type: 'Boolean', required: false },
        { name: 'date_of_exit', label: 'Date of Exit', type: 'Date', required: false }
      ]
    },
    {
      category: 'Compensation & Benefits',
      fields: [
        { name: 'salary', label: 'Monthly Salary', type: 'Number', required: false },
        { name: 'cpf_contribution', label: 'CPF Contribution', type: 'Boolean', required: false },
        { name: 'tax_identification_number', label: 'Tax ID Number', type: 'Text', required: false },
        { name: 'bank_name', label: 'Bank Name', type: 'Text', required: false },
        { name: 'bank_account_number', label: 'Bank Account Number', type: 'Text', required: false },
        { name: 'salary_currency', label: 'Salary Currency', type: 'Text', required: false }
      ]
    },
    {
      category: 'Compliance',
      fields: [
        { name: 'mom_occupation_group', label: 'MOM Occupation Group', type: 'Text', required: false },
        { name: 'residency_status', label: 'Residency Status', type: 'Text', required: false },
        { name: 'work_permit_number', label: 'Work Permit Number', type: 'Text', required: false },
        { name: 'work_pass_expiry_date', label: 'Work Pass Expiry Date', type: 'Date', required: false }
      ]
    }
  ];
}
