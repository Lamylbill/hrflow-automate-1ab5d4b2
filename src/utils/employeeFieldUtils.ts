
export interface FieldMeta {
  name: string;
  label: string;
  type: string;
  required: boolean;
  isAdvanced?: boolean;
  options?: string[];
  category?: string;
}

export interface FieldCategory {
  category: string;
  fields: FieldMeta[];
}

export const getCountryList = (): string[] => [
  'Singapore',
  'Malaysia',
  'China',
  'India',
  'Philippines',
  'Indonesia',
  'Vietnam',
  'Thailand',
  'Myanmar',
  'Bangladesh',
  'Other'
];

export const getReligionList = (): string[] => [
  'Buddhism',
  'Christianity',
  'Hinduism',
  'Islam',
  'Taoism',
  'No Religion',
  'Other'
];

export const getBanksList = (): string[] => [
  'DBS Bank',
  'OCBC Bank',
  'UOB Bank',
  'Standard Chartered',
  'Citibank',
  'Maybank',
  'HSBC',
  'Other'
];

export const fullEmployeeFieldList: FieldMeta[] = [
  // Personal Info - Basic
  { name: 'full_name', label: 'Full Name', type: 'text', required: true, category: 'Personal' },
  { name: 'gender', label: 'Gender', type: 'dropdown', options: ['Male', 'Female', 'Other'], required: false, category: 'Personal' },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'date', required: false, category: 'Personal' },
  { name: 'nationality', label: 'Nationality', type: 'dropdown', options: getCountryList(), required: false, category: 'Personal' },
  { name: 'contact_number', label: 'Contact Number', type: 'text', required: false, category: 'Personal' },
  { name: 'email', label: 'Email Address', type: 'email', required: true, category: 'Personal' },
  
  // Personal Info - Advanced
  { name: 'marital_status', label: 'Marital Status', type: 'dropdown', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: false, isAdvanced: true, category: 'Personal' },
  { name: 'race', label: 'Race', type: 'dropdown', options: ['Chinese', 'Malay', 'Indian', 'Others'], required: false, isAdvanced: true, category: 'Personal' },
  { name: 'religion', label: 'Religion', type: 'dropdown', options: getReligionList(), required: false, isAdvanced: true, category: 'Personal' },
  { name: 'nric', label: 'NRIC/FIN', type: 'text', required: false, isAdvanced: true, category: 'Personal' },
  { name: 'profile_photo', label: 'Profile Photo', type: 'upload', required: false, isAdvanced: true, category: 'Personal' },
  { name: 'personal_info_open_1', label: 'Additional Info', type: 'text', required: false, isAdvanced: true, category: 'Personal' },
  
  // Employment Info - Basic
  { name: 'job_title', label: 'Job Title', type: 'text', required: false, category: 'Employment' },
  { name: 'department', label: 'Department', type: 'dropdown', options: ['HR', 'Finance', 'IT', 'Operations', 'Sales', 'Marketing', 'Customer Service', 'Other'], required: false, category: 'Employment' },
  { name: 'employment_type', label: 'Employment Type', type: 'dropdown', options: ['Full-time', 'Part-time', 'Contract', 'Intern', 'Temporary'], required: false, category: 'Employment' },
  { name: 'date_of_hire', label: 'Date of Hire', type: 'date', required: false, category: 'Employment' },
  { name: 'supervisor', label: 'Supervisor', type: 'text', required: false, category: 'Employment' },
  { name: 'employment_status', label: 'Employment Status', type: 'dropdown', options: ['Active', 'On Leave', 'Resigned', 'Terminated'], required: false, category: 'Employment' },
  
  // Employment Info - Advanced
  { name: 'confirmation_date', label: 'Confirmation Date', type: 'date', required: false, isAdvanced: true, category: 'Employment' },
  { name: 'probation_end', label: 'Probation End Date', type: 'date', required: false, isAdvanced: true, category: 'Employment' },
  { name: 'job_grade', label: 'Job Grade / Level', type: 'text', required: false, isAdvanced: true, category: 'Employment' },
  { name: 'employee_code', label: 'Employee Code', type: 'text', required: false, isAdvanced: true, category: 'Employment' },
  { name: 'employment_info_open_2', label: 'Additional Info 1', type: 'text', required: false, isAdvanced: true, category: 'Employment' },
  { name: 'employment_info_open_3', label: 'Additional Info 2', type: 'text', required: false, isAdvanced: true, category: 'Employment' },
  
  // Contract & Lifecycle - Basic
  { name: 'contract_type', label: 'Contract Type', type: 'dropdown', options: ['Permanent', 'Contract', 'Freelance'], required: false, category: 'Contract' },
  { name: 'contract_start', label: 'Contract Start Date', type: 'date', required: false, category: 'Contract' },
  { name: 'work_hours', label: 'Work Hours / Week', type: 'number', required: false, category: 'Contract' },
  { name: 'work_pass_type', label: 'Work Pass Type', type: 'dropdown', options: ['EP', 'SP', 'WP', 'DP', 'LTVP', 'None'], required: false, category: 'Contract' },
  { name: 'work_pass_number', label: 'Work Pass Number', type: 'text', required: false, category: 'Contract' },
  { name: 'work_pass_expiry', label: 'Work Pass Expiry', type: 'date', required: false, category: 'Contract' },
  
  // Contract & Lifecycle - Advanced
  { name: 'contract_end', label: 'Contract End Date', type: 'date', required: false, isAdvanced: true, category: 'Contract' },
  { name: 'notice_period', label: 'Notice Period', type: 'number', required: false, isAdvanced: true, category: 'Contract' },
  { name: 'resignation_date', label: 'Resignation Date', type: 'date', required: false, isAdvanced: true, category: 'Contract' },
  { name: 'last_working_day', label: 'Last Working Day', type: 'date', required: false, isAdvanced: true, category: 'Contract' },
  { name: 'exit_reason', label: 'Exit Reason', type: 'text', required: false, isAdvanced: true, category: 'Contract' },
  { name: 'rehire_eligibility', label: 'Rehire Eligibility', type: 'dropdown', options: ['Yes', 'No'], required: false, isAdvanced: true, category: 'Contract' },
  
  // Compensation & Benefits - Basic
  { name: 'gross_salary', label: 'Monthly Gross Salary', type: 'number', required: false, category: 'Compensation' },
  { name: 'basic_salary', label: 'Basic Salary', type: 'number', required: false, category: 'Compensation' },
  { name: 'cpf_contribution', label: 'CPF Contribution', type: 'dropdown', options: ['Yes', 'No'], required: false, category: 'Compensation' },
  { name: 'allowances', label: 'Allowances', type: 'number', required: false, category: 'Compensation' },
  { name: 'bonus_eligible', label: 'Bonus Eligibility', type: 'dropdown', options: ['Yes', 'No'], required: false, category: 'Compensation' },
  { name: 'payroll_cycle', label: 'Payroll Cycle', type: 'dropdown', options: ['Monthly', 'Biweekly'], required: false, category: 'Compensation' },
  
  // Compensation & Benefits - Advanced
  { name: 'bank_account', label: 'Bank Account Number', type: 'text', required: false, isAdvanced: true, category: 'Compensation' },
  { name: 'bank_name', label: 'Bank Name', type: 'dropdown', options: getBanksList(), required: false, isAdvanced: true, category: 'Compensation' },
  { name: 'pay_mode', label: 'Pay Mode', type: 'dropdown', options: ['GIRO', 'Cheque', 'Cash'], required: false, isAdvanced: true, category: 'Compensation' },
  { name: 'ot_eligible', label: 'Overtime Eligibility', type: 'dropdown', options: ['Yes', 'No'], required: false, isAdvanced: true, category: 'Compensation' },
  { name: 'annual_bonus_eligible', label: 'Annual Bonus Eligibility', type: 'dropdown', options: ['Yes', 'No'], required: false, isAdvanced: true, category: 'Compensation' },
  { name: 'benefits_tier', label: 'Benefits Tier', type: 'dropdown', options: ['Tier 1', 'Tier 2', 'Tier 3'], required: false, isAdvanced: true, category: 'Compensation' },
  
  // Compliance - Basic
  { name: 'cpf_status', label: 'CPF Status', type: 'dropdown', options: ['Contributing', 'Exempted'], required: false, category: 'Compliance' },
  { name: 'tax_file_no', label: 'Income Tax File No.', type: 'text', required: false, category: 'Compliance' },
  { name: 'mom_status', label: 'MOM Work Pass Status', type: 'dropdown', options: ['Compliant', 'Non-compliant'], required: false, category: 'Compliance' },
  { name: 'ns_status', label: 'NS Status', type: 'dropdown', options: ['Not Applicable', 'Completed', 'Reservist', 'Exempted'], required: false, category: 'Compliance' },
  { name: 'skillsfuture_eligible', label: 'SkillsFuture Eligible', type: 'dropdown', options: ['Yes', 'No'], required: false, category: 'Compliance' },
  { name: 'has_dependants', label: 'Dependant Pass', type: 'dropdown', options: ['Yes', 'No'], required: false, category: 'Compliance' },
  
  // Compliance - Advanced
  { name: 'tax_residency', label: 'Tax Residency', type: 'dropdown', options: ['Resident', 'Non-Resident'], required: false, isAdvanced: true, category: 'Compliance' },
  { name: 'ir8a_required', label: 'IR8A Required', type: 'dropdown', options: ['Yes', 'No'], required: false, isAdvanced: true, category: 'Compliance' },
  { name: 'cpf_submission_number', label: 'CPF Submission Number', type: 'text', required: false, isAdvanced: true, category: 'Compliance' },
  { name: 'cpf_account', label: 'Employer CPF Account', type: 'text', required: false, isAdvanced: true, category: 'Compliance' },
  { name: 'leave_category', label: 'Leave Compliance Category', type: 'dropdown', options: ['Standard', 'Foreign Worker', 'Executive', 'Manager'], required: false, isAdvanced: true, category: 'Compliance' },
  { name: 'disciplinary_flags', label: 'Disciplinary Flags', type: 'boolean', required: false, isAdvanced: true, category: 'Compliance' },
];

// Helper functions to get specific field groups
export const getFieldsByCategory = (category: string): FieldMeta[] => {
  return fullEmployeeFieldList.filter(field => field.category === category);
};

export const getBasicFieldsByCategory = (category: string): FieldMeta[] => {
  return fullEmployeeFieldList.filter(field => field.category === category && !field.isAdvanced);
};

export const getAdvancedFieldsByCategory = (category: string): FieldMeta[] => {
  return fullEmployeeFieldList.filter(field => field.category === category && field.isAdvanced);
};

export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  fullEmployeeFieldList.forEach(field => {
    if (field.category) {
      categories.add(field.category);
    }
  });
  return Array.from(categories);
};

export const getCategorizedFields = (): FieldCategory[] => {
  const categories = getAllCategories();
  return categories.map(category => ({
    category,
    fields: getFieldsByCategory(category)
  }));
};

// Helper function to get field metadata by name
export const getFieldMetaByName = (name: string): FieldMeta | undefined => {
  return fullEmployeeFieldList.find(field => field.name === name);
};

// Helper to convert field value based on type (for import/export)
export const convertFieldValue = (field: FieldMeta, value: any): any => {
  if (value === null || value === undefined || value === '') return null;
  
  switch (field.type) {
    case 'boolean':
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lowered = value.toLowerCase().trim();
        return lowered === 'yes' || lowered === 'true' || lowered === '1' || lowered === 'y';
      }
      if (typeof value === 'number') return value !== 0;
      return Boolean(value);
      
    case 'number':
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? null : parsed;
      }
      return null;
      
    case 'date':
      if (value instanceof Date) return value.toISOString().split('T')[0];
      if (typeof value === 'string') {
        // Try to parse date from common formats
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
        return null;
      }
      return null;
      
    case 'dropdown':
      if (typeof value === 'string' && field.options) {
        // Try to match against options, case-insensitive
        const loweredValue = value.toLowerCase().trim();
        const matchedOption = field.options.find(opt => 
          opt.toLowerCase().trim() === loweredValue
        );
        return matchedOption || value; // Return matched option or original value
      }
      return value;
      
    default:
      return value;
  }
};
