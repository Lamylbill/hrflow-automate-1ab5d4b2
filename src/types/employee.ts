
export interface Employee {
  id: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
  
  // Personal Info - Basic
  full_name: string;
  gender?: string | null;
  date_of_birth?: string | null;
  nationality?: string | null;
  contact_number?: string | null;
  email: string;
  
  // Personal Info - Advanced
  marital_status?: string | null;
  race?: string | null;
  religion?: string | null;
  nric?: string | null;
  profile_photo?: string | null;
  personal_info_open_1?: string | null;
  
  // Employment Info - Basic
  job_title?: string | null;
  department?: string | null;
  employment_type?: string | null;
  date_of_hire?: string | null;
  supervisor?: string | null;
  employment_status?: string | null;
  
  // Employment Info - Advanced
  confirmation_date?: string | null;
  probation_end?: string | null;
  job_grade?: string | null;
  employee_code?: string | null;
  employment_info_open_2?: string | null;
  employment_info_open_3?: string | null;
  
  // Contract & Lifecycle - Basic
  contract_type?: string | null;
  contract_start?: string | null;
  work_hours?: number | null;
  work_pass_type?: string | null;
  work_pass_number?: string | null;
  work_pass_expiry?: string | null;
  
  // Contract & Lifecycle - Advanced
  contract_end?: string | null;
  notice_period?: number | null;
  resignation_date?: string | null;
  last_working_day?: string | null;
  exit_reason?: string | null;
  rehire_eligibility?: string | null;
  
  // Compensation & Benefits - Basic
  gross_salary?: number | null;
  basic_salary?: number | null;
  cpf_contribution?: string | null;
  allowances?: number | null;
  bonus_eligible?: string | null;
  payroll_cycle?: string | null;
  
  // Compensation & Benefits - Advanced
  bank_account?: string | null;
  bank_name?: string | null;
  pay_mode?: string | null;
  ot_eligible?: string | null;
  annual_bonus_eligible?: string | null;
  benefits_tier?: string | null;
  
  // Compliance - Basic
  cpf_status?: string | null;
  tax_file_no?: string | null;
  mom_status?: string | null;
  ns_status?: string | null;
  skillsfuture_eligible?: string | null;
  has_dependants?: string | null;
  
  // Compliance - Advanced
  tax_residency?: string | null;
  ir8a_required?: string | null;
  cpf_submission_number?: string | null;
  cpf_account?: string | null;
  leave_category?: string | null;
  disciplinary_flags?: boolean | null;
  
  // Legacy fields - for backward compatibility during migration
  profile_picture?: string | null; // Map to profile_photo
  phone_number?: string | null; // Map to contact_number
  first_name?: string | null; // For backward compatibility
  middle_name?: string | null; // For backward compatibility
  last_name?: string | null; // For backward compatibility
  identity_no?: string | null; // Map to nric
  reporting_manager?: string | null; // Map to supervisor
  contract_date_start?: string | null; // Map to contract_start
  contract_date_end?: string | null; // Map to contract_end
  probation_period?: number | null; // No direct mapping, but keep for compatibility
  initial_join_date?: string | null; // No direct mapping
  confirmed_date?: string | null; // Map to confirmation_date
  date_of_exit?: string | null; // No direct mapping
  salary?: number | null; // Map to gross_salary
  pay_type?: string | null; // No direct mapping
  salary_currency?: string | null; // No direct mapping
  bank_account_number?: string | null; // Map to bank_account
  bank_branch?: string | null; // No direct mapping
  beneficiary_name?: string | null; // No direct mapping
  mom_occupation_group?: string | null; // No direct mapping
  residency_status?: string | null; // No direct mapping
  union_membership?: string | null; // No direct mapping
  cpf_account_number?: string | null; // Map to cpf_account
  tax_identification_number?: string | null; // Map to tax_file_no
  work_permit_number?: string | null; // Map to work_pass_number
  notes?: string | null; // No direct mapping
}

// Related entity types for the tables that store multiple items per employee
export interface EmployeeAllowance {
  id: string;
  employee_id: string;
  allowance_type: string;
  date_start?: string | null;
  date_end?: string | null;
  amount?: number | null;
  currency?: string | null;
  run_type?: string | null;
  bi_monthly_option?: string | null;
  pay_batch?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeFamilyMember {
  id: string;
  employee_id: string;
  name: string;
  relationship?: string | null;
  date_of_birth?: string | null;
  contact_number?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeEducation {
  id: string;
  employee_id: string;
  qualification?: string | null;
  major?: string | null;
  institute_name?: string | null;
  graduation_year?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeWorkExperience {
  id: string;
  employee_id: string;
  company_name?: string | null;
  job_title?: string | null;
  date_start?: string | null;
  date_end?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeAppraisalRating {
  id: string;
  employee_id: string;
  date_start?: string | null;
  appraisal_type?: string | null;
  rating?: string | null;
  remarks?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Type for creating or updating an employee with related entities
export interface EmployeeFormData {
  employee: Employee;
  allowances?: EmployeeAllowance[];
  familyMembers?: EmployeeFamilyMember[];
  education?: EmployeeEducation[];
  workExperience?: EmployeeWorkExperience[];
  appraisalRatings?: EmployeeAppraisalRating[];
  documents?: File[];
}

// Updated to include id for editing existing employees
export type EmployeeFormValues = Omit<Employee, 'created_at' | 'updated_at'>;
