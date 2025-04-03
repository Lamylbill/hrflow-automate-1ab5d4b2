import { Employee } from '@/types/employee';

// Field categories
export const fieldCategories = [
  'personal-info',
  'employment-info',
  'contract-lifecycle',
  'compensation-benefits',
  'compliance',
  'other'
];

// Field type definitions
export type FieldType = 'text' | 'email' | 'number' | 'date' | 'dropdown' | 'boolean' | 'upload';

// Field metadata interface
export interface FieldMeta {
  name: string;
  label: string;
  type: FieldType;
  category: string;
  isAdvanced: boolean;
  options?: string[];
  required?: boolean;
}

// Define all employee fields with metadata
export const fullEmployeeFieldList: FieldMeta[] = [
  // Personal Info - Basic
  { name: 'full_name', label: 'Full Name', type: 'text', category: 'personal-info', isAdvanced: false, required: true },
  { name: 'gender', label: 'Gender', type: 'dropdown', category: 'personal-info', isAdvanced: false, options: ['Male', 'Female', 'Other'] },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', category: 'personal-info', isAdvanced: false },
  { name: 'nationality', label: 'Nationality', type: 'dropdown', category: 'personal-info', isAdvanced: false, options: ['Singapore', 'Malaysia', 'Indonesia', 'Other'] },
  { name: 'contact_number', label: 'Contact Number', type: 'text', category: 'personal-info', isAdvanced: false },
  { name: 'email', label: 'Email Address', type: 'email', category: 'personal-info', isAdvanced: false, required: true },
  
  // Personal Info - Advanced
  { name: 'marital_status', label: 'Marital Status', type: 'dropdown', category: 'personal-info', isAdvanced: true, options: ['Single', 'Married', 'Divorced', 'Widowed'] },
  { name: 'race', label: 'Race', type: 'dropdown', category: 'personal-info', isAdvanced: true, options: ['Chinese', 'Malay', 'Indian', 'Others'] },
  { name: 'religion', label: 'Religion', type: 'dropdown', category: 'personal-info', isAdvanced: true, options: ['Buddhism', 'Christianity', 'Hinduism', 'Islam', 'Other'] },
  { name: 'nric', label: 'NRIC/FIN', type: 'text', category: 'personal-info', isAdvanced: true },
  { name: 'profile_photo', label: 'Profile Photo', type: 'upload', category: 'personal-info', isAdvanced: true },
  { name: 'personal_info_open_1', label: 'Additional Info', type: 'text', category: 'personal-info', isAdvanced: true },
  
  // Employment Info - Basic
  { name: 'job_title', label: 'Job Title', type: 'text', category: 'employment-info', isAdvanced: false },
  { name: 'department', label: 'Department', type: 'dropdown', category: 'employment-info', isAdvanced: false },
  { name: 'employment_type', label: 'Employment Type', type: 'dropdown', category: 'employment-info', isAdvanced: false, options: ['Full-time', 'Part-time', 'Contract', 'Intern'] },
  { name: 'date_of_hire', label: 'Date of Hire', type: 'date', category: 'employment-info', isAdvanced: false },
  { name: 'supervisor', label: 'Supervisor', type: 'text', category: 'employment-info', isAdvanced: false },
  { name: 'employment_status', label: 'Employment Status', type: 'dropdown', category: 'employment-info', isAdvanced: false, options: ['Active', 'On Leave', 'Resigned', 'Terminated'] },
  
  // Employment Info - Advanced
  { name: 'confirmation_date', label: 'Confirmation Date', type: 'date', category: 'employment-info', isAdvanced: true },
  { name: 'probation_end', label: 'Probation End Date', type: 'date', category: 'employment-info', isAdvanced: true },
  { name: 'job_grade', label: 'Job Grade / Level', type: 'text', category: 'employment-info', isAdvanced: true },
  { name: 'employee_code', label: 'Employee Code', type: 'text', category: 'employment-info', isAdvanced: true },
  { name: 'employment_info_open_2', label: 'Additional Info 1', type: 'text', category: 'employment-info', isAdvanced: true },
  { name: 'employment_info_open_3', label: 'Additional Info 2', type: 'text', category: 'employment-info', isAdvanced: true },
  
  // Contract & Lifecycle - Basic
  { name: 'contract_type', label: 'Contract Type', type: 'dropdown', category: 'contract-lifecycle', isAdvanced: false, options: ['Permanent', 'Contract', 'Freelance'] },
  { name: 'contract_start', label: 'Contract Start Date', type: 'date', category: 'contract-lifecycle', isAdvanced: false },
  { name: 'work_hours', label: 'Work Hours / Week', type: 'number', category: 'contract-lifecycle', isAdvanced: false },
  { name: 'work_pass_type', label: 'Work Pass Type', type: 'dropdown', category: 'contract-lifecycle', isAdvanced: false, options: ['EP', 'SP', 'WP', 'DP', 'LTVP', 'None'] },
  { name: 'work_pass_number', label: 'Work Pass Number', type: 'text', category: 'contract-lifecycle', isAdvanced: false },
  { name: 'work_pass_expiry', label: 'Work Pass Expiry', type: 'date', category: 'contract-lifecycle', isAdvanced: false },
  
  // Contract & Lifecycle - Advanced
  { name: 'contract_end', label: 'Contract End Date', type: 'date', category: 'contract-lifecycle', isAdvanced: true },
  { name: 'notice_period', label: 'Notice Period (Days)', type: 'number', category: 'contract-lifecycle', isAdvanced: true },
  { name: 'resignation_date', label: 'Resignation Date', type: 'date', category: 'contract-lifecycle', isAdvanced: true },
  { name: 'last_working_day', label: 'Last Working Day', type: 'date', category: 'contract-lifecycle', isAdvanced: true },
  { name: 'exit_reason', label: 'Exit Reason', type: 'text', category: 'contract-lifecycle', isAdvanced: true },
  { name: 'rehire_eligibility', label: 'Rehire Eligibility', type: 'dropdown', category: 'contract-lifecycle', isAdvanced: true, options: ['Yes', 'No'] },
  
  // Compensation & Benefits - Basic
  { name: 'gross_salary', label: 'Monthly Gross Salary', type: 'number', category: 'compensation-benefits', isAdvanced: false },
  { name: 'basic_salary', label: 'Basic Salary', type: 'number', category: 'compensation-benefits', isAdvanced: false },
  { name: 'cpf_contribution', label: 'CPF Contribution', type: 'dropdown', category: 'compensation-benefits', isAdvanced: false, options: ['Yes', 'No'] },
  { name: 'allowances', label: 'Allowances', type: 'number', category: 'compensation-benefits', isAdvanced: false },
  { name: 'bonus_eligible', label: 'Bonus Eligibility', type: 'dropdown', category: 'compensation-benefits', isAdvanced: false, options: ['Yes', 'No'] },
  { name: 'payroll_cycle', label: 'Payroll Cycle', type: 'dropdown', category: 'compensation-benefits', isAdvanced: false, options: ['Monthly', 'Biweekly'] },
  
  // Compensation & Benefits - Advanced
  { name: 'bank_account', label: 'Bank Account Number', type: 'text', category: 'compensation-benefits', isAdvanced: true },
  { name: 'bank_name', label: 'Bank Name', type: 'dropdown', category: 'compensation-benefits', isAdvanced: true, options: ['DBS', 'OCBC', 'UOB', 'Other'] },
  { name: 'pay_mode', label: 'Pay Mode', type: 'dropdown', category: 'compensation-benefits', isAdvanced: true, options: ['GIRO', 'Cheque', 'Cash'] },
  { name: 'ot_eligible', label: 'Overtime Eligibility', type: 'dropdown', category: 'compensation-benefits', isAdvanced: true, options: ['Yes', 'No'] },
  { name: 'annual_bonus_eligible', label: 'Annual Bonus Eligibility', type: 'dropdown', category: 'compensation-benefits', isAdvanced: true, options: ['Yes', 'No'] },
  { name: 'benefits_tier', label: 'Benefits Tier', type: 'dropdown', category: 'compensation-benefits', isAdvanced: true, options: ['Tier 1', 'Tier 2', 'Tier 3'] },
  
  // Compliance - Basic
  { name: 'cpf_status', label: 'CPF Status', type: 'dropdown', category: 'compliance', isAdvanced: false, options: ['Contributing', 'Exempted'] },
  { name: 'tax_file_no', label: 'Income Tax File No.', type: 'text', category: 'compliance', isAdvanced: false },
  { name: 'mom_status', label: 'MOM Work Pass Status', type: 'dropdown', category: 'compliance', isAdvanced: false, options: ['Compliant', 'Non-compliant'] },
  { name: 'ns_status', label: 'NS Status', type: 'dropdown', category: 'compliance', isAdvanced: false, options: ['Not Applicable', 'Completed', 'Reservist', 'Exempted'] },
  { name: 'skillsfuture_eligible', label: 'SkillsFuture Eligible', type: 'dropdown', category: 'compliance', isAdvanced: false, options: ['Yes', 'No'] },
  { name: 'has_dependants', label: 'Dependant Pass', type: 'dropdown', category: 'compliance', isAdvanced: false, options: ['Yes', 'No'] },
  
  // Compliance - Advanced
  { name: 'tax_residency', label: 'Tax Residency', type: 'dropdown', category: 'compliance', isAdvanced: true, options: ['Resident', 'Non-Resident'] },
  { name: 'ir8a_required', label: 'IR8A Required', type: 'dropdown', category: 'compliance', isAdvanced: true, options: ['Yes', 'No'] },
  { name: 'cpf_submission_number', label: 'CPF Submission Number', type: 'text', category: 'compliance', isAdvanced: true },
  { name: 'cpf_account', label: 'Employer CPF Account', type: 'text', category: 'compliance', isAdvanced: true },
  { name: 'leave_category', label: 'Leave Compliance Category', type: 'dropdown', category: 'compliance', isAdvanced: true, options: ['Category 1', 'Category 2', 'Category 3'] },
  { name: 'disciplinary_flags', label: 'Disciplinary Flags', type: 'boolean', category: 'compliance', isAdvanced: true },
  
  // Other (for legacy or non-categorized fields)
  { name: 'notes', label: 'Notes', type: 'text', category: 'other', isAdvanced: false },
];

// Helper functions

// Get all field categories
export const getAllCategories = (): string[] => {
  return [...new Set(fullEmployeeFieldList.map(field => field.category))];
};

// Get field metadata by name
export const getFieldMetaByName = (name: string): FieldMeta | undefined => {
  return fullEmployeeFieldList.find(field => field.name === name);
};

// Get fields by category
export const getFieldsByCategory = (category: string): FieldMeta[] => {
  return fullEmployeeFieldList.filter(field => field.category === category);
};

// Get only basic fields
export const getBasicFields = (): FieldMeta[] => {
  return fullEmployeeFieldList.filter(field => !field.isAdvanced);
};

// Get only advanced fields
export const getAdvancedFields = (): FieldMeta[] => {
  return fullEmployeeFieldList.filter(field => field.isAdvanced);
};

// Utility to convert field values based on their type
export const convertFieldValue = (field: FieldMeta, value: any): any => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  switch (field.type) {
    case 'number':
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    case 'date':
      try {
        // Handle various date formats
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
      } catch {
        return null;
      }
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lowerVal = value.toLowerCase();
        if (['yes', 'true', '1', 'y'].includes(lowerVal)) return true;
        if (['no', 'false', '0', 'n'].includes(lowerVal)) return false;
      }
      return null;
    case 'dropdown':
      // Validate against options if they exist
      if (field.options && !field.options.includes(value)) {
        // Try case-insensitive match
        const matchingOption = field.options.find(
          opt => opt.toLowerCase() === value.toString().toLowerCase()
        );
        return matchingOption || value;
      }
      return value;
    default:
      return value;
  }
};

// Map legacy field names to new field names
export const mapLegacyFieldNames = (employee: any): Employee => {
  const result: any = { ...employee };

  // Map legacy fields to new fields
  if (employee.profile_picture && !employee.profile_photo) {
    result.profile_photo = employee.profile_picture;
  }

  if (employee.phone_number && !employee.contact_number) {
    result.contact_number = employee.phone_number;
  }

  if (employee.identity_no && !employee.nric) {
    result.nric = employee.identity_no;
  }

  if (employee.reporting_manager && !employee.supervisor) {
    result.supervisor = employee.reporting_manager;
  }

  if (employee.contract_date_start && !employee.contract_start) {
    result.contract_start = employee.contract_date_start;
  }

  if (employee.contract_date_end && !employee.contract_end) {
    result.contract_end = employee.contract_date_end;
  }

  if (employee.confirmed_date && !employee.confirmation_date) {
    result.confirmation_date = employee.confirmed_date;
  }

  if (employee.salary && !employee.gross_salary) {
    result.gross_salary = employee.salary;
  }

  if (employee.bank_account_number && !employee.bank_account) {
    result.bank_account = employee.bank_account_number;
  }

  if (employee.cpf_account_number && !employee.cpf_account) {
    result.cpf_account = employee.cpf_account_number;
  }

  if (employee.tax_identification_number && !employee.tax_file_no) {
    result.tax_file_no = employee.tax_identification_number;
  }

  if (employee.work_permit_number && !employee.work_pass_number) {
    result.work_pass_number = employee.work_permit_number;
  }

  // Convert boolean string values to actual booleans
  if (typeof result.cpf_contribution === 'string') {
    result.cpf_contribution = result.cpf_contribution === 'Yes' ? 'Yes' : 'No';
  }

  if (typeof result.disciplinary_flags === 'string') {
    result.disciplinary_flags = result.disciplinary_flags === 'Yes' || result.disciplinary_flags === 'true';
  }

  return result as Employee;
};

// Create a standardized employee object with mapped fields
export const standardizeEmployee = (employeeData: any): Employee => {
  return mapLegacyFieldNames(employeeData);
};
