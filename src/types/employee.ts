
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
  cpf_contribution?: boolean | null;
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
  profile_picture?: string | null;
  phone_number?: string | null;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  identity_no?: string | null;
  reporting_manager?: string | null;
  contract_date_start?: string | null;
  contract_date_end?: string | null;
  probation_period?: number | null;
  initial_join_date?: string | null;
  confirmed_date?: string | null;
  date_of_exit?: string | null;
  salary?: number | null;
  pay_type?: string | null;
  salary_currency?: string | null;
  bank_account_number?: string | null;
  bank_branch?: string | null;
  beneficiary_name?: string | null;
  mom_occupation_group?: string | null;
  residency_status?: string | null;
  union_membership?: string | null;
  cpf_account_number?: string | null;
  tax_identification_number?: string | null;
  work_permit_number?: string | null;
  notes?: string | null;
  
  // Additional fields for address
  address_type?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  postal_code?: string | null;
  country_region?: string | null;
  home_address?: string | null;
  
  // Additional fields for assignments
  assignment_date_start?: string | null;
  status_change_reason?: string | null;
  company?: string | null;
  cost_center?: string | null;
  hr_rpt_job_category?: string | null;
  hr_rpt_division_category?: string | null;
  leave_grade?: string | null;
  pay_group?: string | null;
  manager?: string | null;
  
  // Additional fields for attendance
  attendance_calendar?: string | null;
  ot_group?: string | null;
  must_clock?: boolean | null;
  all_work_day?: boolean | null;
  badge_no?: string | null;
  imei_uuid_no?: string | null;
  clock_codes?: string[] | null;
  clock_area_codes?: string[] | null;
  
  // Additional fields for salary
  work_days_per_week?: number | null;
  work_hours_per_day?: number | null;
  work_hours_per_year?: number | null;
  work_days_per_year?: number | null;
  salary_arrears?: number | null;
  freeze_payment?: boolean | null;
  bank_currency?: string | null;
  allocation_type?: string | null;
  allocation_amount?: number | null;
  allocation_account?: string | null;
  allocation_run?: string | null;
  salary_date_start?: string | null;
  salary_status_change_reason?: string | null;
  salary_grade?: string | null;
  salary_fixed?: number | null;
  mvc?: number | null;
  mvc_percentage?: number | null;
  salary_gross?: number | null;
  leave_entitlement?: number | null;
  leave_balance?: number | null;
  medical_entitlement?: number | null;
  
  // Additional fields for statutory
  mom_employee_type?: string | null;
  mom_bc_occupation_group?: string | null;
  mom_bc_employee_type?: string | null;
  mom_bc_employment_type?: string | null;
  mom_bc_employee_group?: string | null;
  funds?: string | null;
  mso_scheme?: string | null;
  pr_issue_date?: string | null;
  pr_renounce_date?: string | null;
  statutory_date_start?: string | null;
  statutory_date_end?: string | null;
  membership_no?: string | null;
  rest_day_per_week?: string | null;
  overtime_payment_period?: string | null;
  overtime_rate_of_pay?: number | null;
  paid_medical_examination_fee?: boolean | null;
  other_medical_benefit?: string | null;
  termination_notice_period?: number | null;
  work_pass_expiry_date?: string | null;
  
  // Additional fields for employment
  join_date_for_leave?: string | null;
  recruitment_type?: string | null;
  new_graduate?: boolean | null;
  probation_due?: string | null;
  probation_status?: string | null;
  resignation_tender_date?: string | null;
  exit_interview_date?: string | null;
  shorted_period?: number | null;
  shorted_period_type?: string | null;
  rehire?: boolean | null;
  previous_employee_code?: string | null;
  service_length_adjustment?: number | null;
  service_length_total?: number | null;
  previous_work_experience?: number | null;
  work_experience_to_date?: number | null;
  no_of_contracts?: number | null;
  contract_adjustment?: number | null;
  no_of_contracts_total?: number | null;
  last_working_date?: string | null;
  extension_no?: string | null;
  mobile_no?: string | null;
  telephone_no?: string | null;
  personal_email?: string | null;
  personal_mobile_no?: string | null;
  
  // Additional fields for personal info
  nationality_other?: string | null;
  title?: string | null;
  login_id?: string | null;
  birth_place?: string | null;
  marriage_date?: string | null;
  no_of_children?: number | null;
  ethnic_origin?: string | null;
  
  // Additional fields for other info
  skill_set?: string[] | null;
  ns_group?: string | null;
  vaccination_status?: string | null;
  group_hospital_surgical_plan?: string | null;
  group_personal_accident_plan?: string | null;
  outpatient_medical_plan?: string | null;
  thirteenth_month_entitlement?: boolean | null;
  benefits_enrolled?: string[] | null;
  last_performance_review?: string | null;
  performance_score?: number | null;
  
  // Additional fields for legacy contract tab
  contract_nature?: string | null;
  renewal?: string | null;
  contract_signed?: boolean | null;
  
  // Emergency Contact Fields
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_relationship?: string | null;
  
  // Missing fields that are used in various tabs
  probation_period_type?: string | null;
  qualification?: string | null;
}

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

export interface EmployeeFormData {
  employee: Employee;
  allowances?: EmployeeAllowance[];
  familyMembers?: EmployeeFamilyMember[];
  education?: EmployeeEducation[];
  workExperience?: EmployeeWorkExperience[];
  appraisalRatings?: EmployeeAppraisalRating[];
  documents?: File[];
}

export type EmployeeFormValues = Omit<Employee, 'created_at' | 'updated_at'>;
