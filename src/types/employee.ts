
export interface Employee {
  id: string;
  user_id: string;
  full_name: string;
  profile_picture?: string | null;
  job_title?: string | null;
  department?: string | null;
  email: string;
  phone_number?: string | null;
  date_of_hire?: string | null;
  employment_type?: string | null;
  employment_status?: string | null;
  date_of_exit?: string | null;
  employee_code?: string | null;
  gender?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
  reporting_manager?: string | null;
  home_address?: string | null;
  postal_code?: string | null;
  emergency_contact_name?: string | null;
  emergency_contact_phone?: string | null;
  salary?: number | null;
  bank_name?: string | null;
  bank_account_number?: string | null;
  cpf_contribution?: boolean | null;
  cpf_account_number?: string | null;
  tax_identification_number?: string | null;
  leave_entitlement?: number | null;
  leave_balance?: number | null;
  medical_entitlement?: number | null;
  benefits_enrolled?: string[] | null;
  work_permit_number?: string | null;
  work_pass_expiry_date?: string | null;
  contract_signed?: boolean | null;
  probation_status?: string | null;
  last_performance_review?: string | null;
  performance_score?: number | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Updated to include id for editing existing employees
export type EmployeeFormValues = Omit<Employee, 'created_at' | 'updated_at'>;
