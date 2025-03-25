export interface Employee {
  id: string;
  user_id: string;
  
  // Personal Tab
  full_name: string;
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
  employee_code?: string | null;
  login_id?: string | null;
  title?: string | null;
  alias_name?: string | null;
  local_name?: string | null;
  gender?: string | null;
  nationality?: string | null;
  identity_no?: string | null;
  date_of_birth?: string | null;
  birth_place?: string | null;
  marital_status?: string | null;
  marriage_date?: string | null;
  no_of_children?: number | null;
  retire_age?: number | null;
  ethnic_origin?: string | null;
  religion?: string | null;
  qualification?: string | null;
  web_role?: string | null;
  profile_picture?: string | null;
  
  // Employment Tab
  email: string;
  date_of_hire?: string | null;
  join_date_for_leave?: string | null;
  initial_join_date?: string | null;
  recruitment_type?: string | null;
  new_graduate?: boolean | null;
  probation_period?: number | null;
  probation_period_type?: string | null;
  probation_due?: string | null;
  confirmed_date?: string | null;
  resignation_tender_date?: string | null;
  date_of_exit?: string | null;
  exit_reason?: string | null;
  exit_interview_date?: string | null;
  notice_period?: number | null;
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
  phone_number?: string | null;
  extension_no?: string | null;
  mobile_no?: string | null;
  telephone_no?: string | null;
  personal_email?: string | null;
  personal_mobile_no?: string | null;
  
  // Assignment Tab
  assignment_date_start?: string | null;
  status_change_reason?: string | null;
  company?: string | null;
  department?: string | null;
  job_title?: string | null;
  cost_center?: string | null;
  job_grade?: string | null;
  employment_type?: string | null;
  employment_status?: string | null;
  hr_rpt_job_category?: string | null;
  hr_rpt_division_category?: string | null;
  leave_grade?: string | null;
  pay_group?: string | null;
  manager?: string | null;
  reporting_manager?: string | null;
  
  // Contract Tab
  contract_date_start?: string | null;
  contract_date_end?: string | null;
  contract_type?: string | null;
  contract_nature?: string | null;
  renewal?: string | null;
  contract_signed?: boolean | null;
  
  // Statutory Tab
  mom_occupation_group?: string | null;
  mom_employee_type?: string | null;
  mom_bc_occupation_group?: string | null;
  mom_bc_employee_type?: string | null;
  mom_bc_employment_type?: string | null;
  mom_bc_employee_group?: string | null;
  funds?: string | null;
  mso_scheme?: string | null;
  pr_issue_date?: string | null;
  pr_renounce_date?: string | null;
  residency_status?: string | null;
  union_membership?: string | null;
  statutory_date_start?: string | null;
  statutory_date_end?: string | null;
  membership_no?: string | null;
  rest_day_per_week?: string | null;
  overtime_payment_period?: string | null;
  overtime_rate_of_pay?: number | null;
  paid_medical_examination_fee?: boolean | null;
  other_medical_benefit?: string | null;
  termination_notice_period?: number | null;
  work_permit_number?: string | null;
  work_pass_expiry_date?: string | null;
  cpf_contribution?: boolean | null;
  cpf_account_number?: string | null;
  tax_identification_number?: string | null;
  
  // Salary Tab
  salary?: number | null;
  work_days_per_week?: number | null;
  work_hours_per_day?: number | null;
  work_hours_per_year?: number | null;
  work_days_per_year?: number | null;
  salary_arrears?: number | null;
  freeze_payment?: boolean | null;
  salary_currency?: string | null;
  bank_name?: string | null;
  bank_branch?: string | null;
  bank_account_number?: string | null;
  beneficiary_name?: string | null;
  bank_currency?: string | null;
  allocation_type?: string | null;
  allocation_amount?: number | null;
  allocation_account?: string | null;
  allocation_run?: string | null;
  salary_date_start?: string | null;
  salary_status_change_reason?: string | null;
  pay_mode?: string | null;
  pay_type?: string | null;
  salary_grade?: string | null;
  salary_fixed?: number | null;
  mvc?: number | null;
  mvc_percentage?: number | null;
  salary_gross?: number | null;
  leave_entitlement?: number | null;
  leave_balance?: number | null;
  medical_entitlement?: number | null;
  
  // Attendance Tab
  attendance_calendar?: string | null;
  ot_group?: string | null;
  must_clock?: boolean | null;
  all_work_day?: boolean | null;
  badge_no?: string | null;
  imei_uuid_no?: string | null;
  clock_codes?: string[] | null;
  clock_area_codes?: string[] | null;
  
  // Address Tab
  address_type?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  city?: string | null;
  country_region?: string | null;
  home_address?: string | null;
  postal_code?: string | null;
  
  // Emergency Contact Tab
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  emergency_relationship?: string | null;
  
  // Other Tab
  skill_set?: string[] | null;
  ns_group?: string | null;
  vaccination_status?: string | null;
  group_hospital_surgical_plan?: string | null;
  group_personal_accident_plan?: string | null;
  outpatient_medical_plan?: string | null;
  thirteenth_month_entitlement?: boolean | null;
  benefits_enrolled?: string[] | null;
  notes?: string | null;
  probation_status?: string | null;
  last_performance_review?: string | null;
  performance_score?: number | null;
  
  // System fields
  created_at?: string;
  updated_at?: string;
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
  employee: Omit<Employee, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
  allowances?: Omit<EmployeeAllowance, 'id' | 'employee_id' | 'created_at' | 'updated_at'>[];
  familyMembers?: Omit<EmployeeFamilyMember, 'id' | 'employee_id' | 'created_at' | 'updated_at'>[];
  education?: Omit<EmployeeEducation, 'id' | 'employee_id' | 'created_at' | 'updated_at'>[];
  workExperience?: Omit<EmployeeWorkExperience, 'id' | 'employee_id' | 'created_at' | 'updated_at'>[];
  appraisalRatings?: Omit<EmployeeAppraisalRating, 'id' | 'employee_id' | 'created_at' | 'updated_at'>[];
  documents?: File[];
}

// Updated to include id for editing existing employees
export type EmployeeFormValues = Omit<Employee, 'created_at' | 'updated_at'>;
