export interface FieldMeta {
  name: string;
  label: string;
  type: string;
  required: boolean;
  example?: string;
  description?: string;
  category?: string;
}

export interface FieldCategory {
  category: string;
  fields: FieldMeta[];
}

// Full 160+ fields from Employee interface
export const fullEmployeeFieldList: FieldMeta[] = [
  // Personal Tab
  { name: 'full_name', label: 'Full Name', type: 'Text', required: true, category: 'Personal' },
  { name: 'first_name', label: 'First Name', type: 'Text', required: false, category: 'Personal' },
  { name: 'last_name', label: 'Last Name', type: 'Text', required: false, category: 'Personal' },
  { name: 'middle_name', label: 'Middle Name', type: 'Text', required: false, category: 'Personal' },
  { name: 'employee_code', label: 'Employee Code', type: 'Text', required: false, category: 'Personal' },
  { name: 'login_id', label: 'Login ID', type: 'Text', required: false, category: 'Personal' },
  { name: 'title', label: 'Title', type: 'Text', required: false, category: 'Personal' },
  { name: 'alias_name', label: 'Alias Name', type: 'Text', required: false, category: 'Personal' },
  { name: 'local_name', label: 'Local Name', type: 'Text', required: false, category: 'Personal' },
  { name: 'gender', label: 'Gender', type: 'Text', required: false, category: 'Personal' },
  { name: 'nationality', label: 'Nationality', type: 'Text', required: false, category: 'Personal' },
  { name: 'identity_no', label: 'NRIC / FIN', type: 'Text', required: false, category: 'Personal' },
  { name: 'date_of_birth', label: 'Date of Birth', type: 'Date', required: false, category: 'Personal' },
  { name: 'birth_place', label: 'Place of Birth', type: 'Text', required: false, category: 'Personal' },
  { name: 'marital_status', label: 'Marital Status', type: 'Text', required: false, category: 'Personal' },
  { name: 'marriage_date', label: 'Marriage Date', type: 'Date', required: false, category: 'Personal' },
  { name: 'no_of_children', label: 'Number of Children', type: 'Number', required: false, category: 'Personal' },
  { name: 'retire_age', label: 'Retirement Age', type: 'Number', required: false, category: 'Personal' },
  { name: 'ethnic_origin', label: 'Ethnic Origin', type: 'Text', required: false, category: 'Personal' },
  { name: 'religion', label: 'Religion', type: 'Text', required: false, category: 'Personal' },
  { name: 'qualification', label: 'Qualification', type: 'Text', required: false, category: 'Personal' },
  { name: 'web_role', label: 'Web Role', type: 'Text', required: false, category: 'Personal' },
  { name: 'profile_picture', label: 'Profile Picture', type: 'Text', required: false, category: 'Personal' },

  // Employment Tab
  { name: 'email', label: 'Email', type: 'Email', required: true, category: 'Employment' },
  { name: 'date_of_hire', label: 'Date of Hire', type: 'Date', required: false, category: 'Employment' },
  { name: 'join_date_for_leave', label: 'Join Date for Leave', type: 'Date', required: false, category: 'Employment' },
  { name: 'initial_join_date', label: 'Initial Join Date', type: 'Date', required: false, category: 'Employment' },
  { name: 'recruitment_type', label: 'Recruitment Type', type: 'Text', required: false, category: 'Employment' },
  { name: 'new_graduate', label: 'New Graduate', type: 'Boolean', required: false, category: 'Employment' },
  { name: 'probation_period', label: 'Probation Period', type: 'Number', required: false, category: 'Employment' },
  { name: 'probation_period_type', label: 'Probation Period Type', type: 'Text', required: false, category: 'Employment' },
  { name: 'probation_due', label: 'Probation Due', type: 'Date', required: false, category: 'Employment' },
  { name: 'confirmed_date', label: 'Confirmed Date', type: 'Date', required: false, category: 'Employment' },
  { name: 'resignation_tender_date', label: 'Resignation Tender Date', type: 'Date', required: false, category: 'Employment' },
  { name: 'date_of_exit', label: 'Date of Exit', type: 'Date', required: false, category: 'Employment' },
  { name: 'exit_reason', label: 'Exit Reason', type: 'Text', required: false, category: 'Employment' },
  { name: 'exit_interview_date', label: 'Exit Interview Date', type: 'Date', required: false, category: 'Employment' },
  { name: 'notice_period', label: 'Notice Period', type: 'Number', required: false, category: 'Employment' },
  { name: 'rehire', label: 'Rehire', type: 'Boolean', required: false, category: 'Employment' },
  { name: 'previous_employee_code', label: 'Previous Employee Code', type: 'Text', required: false, category: 'Employment' },
  { name: 'service_length_adjustment', label: 'Service Length Adjustment', type: 'Number', required: false, category: 'Employment' },
  { name: 'service_length_total', label: 'Service Length Total', type: 'Number', required: false, category: 'Employment' },
  { name: 'work_experience_to_date', label: 'Work Experience to Date', type: 'Number', required: false, category: 'Employment' },
  { name: 'previous_work_experience', label: 'Previous Work Experience', type: 'Number', required: false, category: 'Employment' },
  { name: 'phone_number', label: 'Phone Number', type: 'Text', required: false, category: 'Employment' },
  { name: 'mobile_no', label: 'Mobile Number', type: 'Text', required: false, category: 'Employment' },
  { name: 'personal_email', label: 'Personal Email', type: 'Email', required: false, category: 'Employment' },

  // Assignment Tab
  { name: 'assignment_date_start', label: 'Assignment Start Date', type: 'Date', required: false, category: 'Assignment' },
  { name: 'status_change_reason', label: 'Status Change Reason', type: 'Text', required: false, category: 'Assignment' },
  { name: 'company', label: 'Company', type: 'Text', required: false, category: 'Assignment' },
  { name: 'department', label: 'Department', type: 'Text', required: false, category: 'Assignment' },
  { name: 'job_title', label: 'Job Title', type: 'Text', required: false, category: 'Assignment' },
  { name: 'cost_center', label: 'Cost Center', type: 'Text', required: false, category: 'Assignment' },
  { name: 'job_grade', label: 'Job Grade', type: 'Text', required: false, category: 'Assignment' },
  { name: 'employment_type', label: 'Employment Type', type: 'Text', required: false, category: 'Assignment' },
  { name: 'employment_status', label: 'Employment Status', type: 'Text', required: false, category: 'Assignment' },
  { name: 'hr_rpt_job_category', label: 'HR RPT Job Category', type: 'Text', required: false, category: 'Assignment' },
  { name: 'hr_rpt_division_category', label: 'HR RPT Division Category', type: 'Text', required: false, category: 'Assignment' },
  { name: 'leave_grade', label: 'Leave Grade', type: 'Text', required: false, category: 'Assignment' },
  { name: 'pay_group', label: 'Pay Group', type: 'Text', required: false, category: 'Assignment' },
  { name: 'manager', label: 'Manager', type: 'Text', required: false, category: 'Assignment' },
  { name: 'reporting_manager', label: 'Reporting Manager', type: 'Text', required: false, category: 'Assignment' },

  // Contract Tab
  { name: 'contract_date_start', label: 'Contract Start Date', type: 'Date', required: false, category: 'Contract' },
  { name: 'contract_date_end', label: 'Contract End Date', type: 'Date', required: false, category: 'Contract' },
  { name: 'contract_type', label: 'Contract Type', type: 'Text', required: false, category: 'Contract' },
  { name: 'contract_nature', label: 'Contract Nature', type: 'Text', required: false, category: 'Contract' },
  { name: 'renewal', label: 'Renewal', type: 'Text', required: false, category: 'Contract' },
  { name: 'contract_signed', label: 'Contract Signed', type: 'Boolean', required: false, category: 'Contract' },
  
    // Statutory Tab
  { name: 'mom_occupation_group', label: 'MOM Occupation Group', type: 'Text', required: false, category: 'Statutory' },
  { name: 'mom_employee_type', label: 'MOM Employee Type', type: 'Text', required: false, category: 'Statutory' },
  { name: 'mom_bc_occupation_group', label: 'MOM (BC) Occupation Group', type: 'Text', required: false, category: 'Statutory' },
  { name: 'mom_bc_employee_type', label: 'MOM (BC) Employee Type', type: 'Text', required: false, category: 'Statutory' },
  { name: 'mom_bc_employment_type', label: 'MOM (BC) Employment Type', type: 'Text', required: false, category: 'Statutory' },
  { name: 'mom_bc_employee_group', label: 'MOM (BC) Employee Group', type: 'Text', required: false, category: 'Statutory' },
  { name: 'funds', label: 'Funds', type: 'Text', required: false, category: 'Statutory' },
  { name: 'mso_scheme', label: 'MSO Scheme', type: 'Text', required: false, category: 'Statutory' },
  { name: 'pr_issue_date', label: 'PR Issue Date', type: 'Date', required: false, category: 'Statutory' },
  { name: 'pr_renounce_date', label: 'PR Renounce Date', type: 'Date', required: false, category: 'Statutory' },
  { name: 'residency_status', label: 'Residency Status', type: 'Text', required: false, category: 'Statutory' },
  { name: 'union_membership', label: 'Union Membership', type: 'Text', required: false, category: 'Statutory' },
  { name: 'statutory_date_start', label: 'Statutory Start Date', type: 'Date', required: false, category: 'Statutory' },
  { name: 'statutory_date_end', label: 'Statutory End Date', type: 'Date', required: false, category: 'Statutory' },
  { name: 'membership_no', label: 'Membership No.', type: 'Text', required: false, category: 'Statutory' },
  { name: 'rest_day_per_week', label: 'Rest Day per Week', type: 'Text', required: false, category: 'Statutory' },
  { name: 'overtime_payment_period', label: 'Overtime Payment Period', type: 'Text', required: false, category: 'Statutory' },
  { name: 'overtime_rate_of_pay', label: 'Overtime Rate of Pay', type: 'Number', required: false, category: 'Statutory' },
  { name: 'paid_medical_examination_fee', label: 'Paid Medical Examination Fee', type: 'Boolean', required: false, category: 'Statutory' },
  { name: 'other_medical_benefit', label: 'Other Medical Benefit', type: 'Text', required: false, category: 'Statutory' },
  { name: 'termination_notice_period', label: 'Termination Notice Period', type: 'Number', required: false, category: 'Statutory' },
  { name: 'work_permit_number', label: 'Work Permit Number', type: 'Text', required: false, category: 'Statutory' },
  { name: 'work_pass_expiry_date', label: 'Work Pass Expiry Date', type: 'Date', required: false, category: 'Statutory' },
  { name: 'cpf_contribution', label: 'CPF Contribution', type: 'Boolean', required: false, category: 'Statutory' },
  { name: 'cpf_account_number', label: 'CPF Account Number', type: 'Text', required: false, category: 'Statutory' },
  { name: 'tax_identification_number', label: 'Tax ID Number', type: 'Text', required: false, category: 'Statutory' },

// Salary Tab
  { name: 'salary', label: 'Monthly Salary', type: 'Number', required: false, category: 'Salary' },
  { name: 'work_days_per_week', label: 'Work Days per Week', type: 'Number', required: false, category: 'Salary' },
  { name: 'work_hours_per_day', label: 'Work Hours per Day', type: 'Number', required: false, category: 'Salary' },
  { name: 'work_hours_per_year', label: 'Work Hours per Year', type: 'Number', required: false, category: 'Salary' },
  { name: 'work_days_per_year', label: 'Work Days per Year', type: 'Number', required: false, category: 'Salary' },
  { name: 'salary_arrears', label: 'Salary Arrears', type: 'Number', required: false, category: 'Salary' },
  { name: 'freeze_payment', label: 'Freeze Payment', type: 'Boolean', required: false, category: 'Salary' },
  { name: 'salary_currency', label: 'Salary Currency', type: 'Text', required: false, category: 'Salary' },
  { name: 'bank_name', label: 'Bank Name', type: 'Text', required: false, category: 'Salary' },
  { name: 'bank_branch', label: 'Bank Branch', type: 'Text', required: false, category: 'Salary' },
  { name: 'bank_account_number', label: 'Bank Account Number', type: 'Text', required: false, category: 'Salary' },
  { name: 'beneficiary_name', label: 'Beneficiary Name', type: 'Text', required: false, category: 'Salary' },
  { name: 'bank_currency', label: 'Bank Currency', type: 'Text', required: false, category: 'Salary' },
  { name: 'allocation_type', label: 'Allocation Type', type: 'Text', required: false, category: 'Salary' },
  { name: 'allocation_amount', label: 'Allocation Amount', type: 'Number', required: false, category: 'Salary' },
  { name: 'allocation_account', label: 'Allocation Account', type: 'Text', required: false, category: 'Salary' },
  { name: 'allocation_run', label: 'Allocation Run', type: 'Text', required: false, category: 'Salary' },
  { name: 'salary_date_start', label: 'Salary Start Date', type: 'Date', required: false, category: 'Salary' },
  { name: 'salary_status_change_reason', label: 'Salary Status Change Reason', type: 'Text', required: false, category: 'Salary' },
  { name: 'pay_mode', label: 'Pay Mode', type: 'Text', required: false, category: 'Salary' },
  { name: 'pay_type', label: 'Pay Type', type: 'Text', required: false, category: 'Salary' },
  { name: 'salary_grade', label: 'Salary Grade', type: 'Text', required: false, category: 'Salary' },
  { name: 'salary_fixed', label: 'Fixed Salary', type: 'Number', required: false, category: 'Salary' },
  { name: 'mvc', label: 'MVC', type: 'Number', required: false, category: 'Salary' },
  { name: 'mvc_percentage', label: 'MVC Percentage', type: 'Number', required: false, category: 'Salary' },
  { name: 'salary_gross', label: 'Gross Salary', type: 'Number', required: false, category: 'Salary' },
  { name: 'leave_entitlement', label: 'Leave Entitlement', type: 'Number', required: false, category: 'Salary' },
  { name: 'leave_balance', label: 'Leave Balance', type: 'Number', required: false, category: 'Salary' },
  { name: 'medical_entitlement', label: 'Medical Entitlement', type: 'Number', required: false, category: 'Salary' },

  // Attendance Tab
  { name: 'attendance_calendar', label: 'Attendance Calendar', type: 'Text', required: false, category: 'Attendance' },
  { name: 'ot_group', label: 'Overtime Group', type: 'Text', required: false, category: 'Attendance' },
  { name: 'must_clock', label: 'Must Clock', type: 'Boolean', required: false, category: 'Attendance' },
  { name: 'all_work_day', label: 'All Work Day', type: 'Boolean', required: false, category: 'Attendance' },
  { name: 'badge_no', label: 'Badge Number', type: 'Text', required: false, category: 'Attendance' },
  { name: 'imei_uuid_no', label: 'IMEI/UUID Number', type: 'Text', required: false, category: 'Attendance' },
  { name: 'clock_codes', label: 'Clock Codes', type: 'Text', required: false, category: 'Attendance' },
  { name: 'clock_area_codes', label: 'Clock Area Codes', type: 'Text', required: false, category: 'Attendance' },

  // Address Tab
  { name: 'address_type', label: 'Address Type', type: 'Text', required: false, category: 'Address' },
  { name: 'address_line_1', label: 'Address Line 1', type: 'Text', required: false, category: 'Address' },
  { name: 'address_line_2', label: 'Address Line 2', type: 'Text', required: false, category: 'Address' },
  { name: 'city', label: 'City', type: 'Text', required: false, category: 'Address' },
  { name: 'country_region', label: 'Country / Region', type: 'Text', required: false, category: 'Address' },
  { name: 'home_address', label: 'Home Address', type: 'Text', required: false, category: 'Address' },
  { name: 'postal_code', label: 'Postal Code', type: 'Text', required: false, category: 'Address' },

  // Emergency Contact Tab
  { name: 'emergency_contact_name', label: 'Emergency Contact Name', type: 'Text', required: false, category: 'Emergency Contact' },
  { name: 'emergency_contact_phone', label: 'Emergency Contact Phone', type: 'Text', required: false, category: 'Emergency Contact' },
  { name: 'emergency_relationship', label: 'Emergency Contact Relationship', type: 'Text', required: false, category: 'Emergency Contact  ' },
  
  // Other Tab
  { name: 'skill_set', label: 'Skill Set', type: 'Text', required: false, category: 'Other' },
  { name: 'ns_group', label: 'NS Group', type: 'Text', required: false, category: 'Other' },
  { name: 'vaccination_status', label: 'Vaccination Status', type: 'Text', required: false, category: 'Other' },
  { name: 'group_hospital_surgical_plan', label: 'Group Hospital Surgical Plan', type: 'Text', required: false, category: 'Other' },
  { name: 'group_personal_accident_plan', label: 'Group Personal Accident Plan', type: 'Text', required: false, category: 'Other' },
  { name: 'outpatient_medical_plan', label: 'Outpatient Medical Plan', type: 'Text', required: false, category: 'Other' },
  { name: 'thirteenth_month_entitlement', label: '13th Month Entitlement', type: 'Boolean', required: false, category: 'Other' },
  { name: 'benefits_enrolled', label: 'Benefits Enrolled', type: 'Text', required: false, category: 'Other' },
  { name: 'notes', label: 'Notes', type: 'Text', required: false, category: 'Other' },
  { name: 'probation_status', label: 'Probation Status', type: 'Text', required: false, category: 'Other' },
  { name: 'last_performance_review', label: 'Last Performance Review', type: 'Date', required: false, category: 'Other' },
  { name: 'performance_score', label: 'Performance Score', type: 'Number', required: false, category: 'Other' },

    // System Metadata
  { name: 'created_at', label: 'Created At', type: 'DateTime', required: false, category: 'System' },
  { name: 'updated_at', label: 'Updated At', type: 'DateTime', required: false, category: 'Syst  em' },

];

export function getEmployeeFieldsByCategory(): FieldCategory[] {
  const grouped: Record<string, FieldMeta[]> = {};

  fullEmployeeFieldList.forEach(field => {
    const category = field.category || 'Other';
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(field);
  });

  return Object.entries(grouped).map(([category, fields]) => ({ category, fields }));
}
