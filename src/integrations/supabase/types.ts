export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      employee_allowances: {
        Row: {
          allowance_type: string
          amount: number | null
          bi_monthly_option: string | null
          created_at: string
          currency: string | null
          date_end: string | null
          date_start: string | null
          employee_id: string | null
          id: string
          pay_batch: string | null
          run_type: string | null
          updated_at: string
        }
        Insert: {
          allowance_type: string
          amount?: number | null
          bi_monthly_option?: string | null
          created_at?: string
          currency?: string | null
          date_end?: string | null
          date_start?: string | null
          employee_id?: string | null
          id?: string
          pay_batch?: string | null
          run_type?: string | null
          updated_at?: string
        }
        Update: {
          allowance_type?: string
          amount?: number | null
          bi_monthly_option?: string | null
          created_at?: string
          currency?: string | null
          date_end?: string | null
          date_start?: string | null
          employee_id?: string | null
          id?: string
          pay_batch?: string | null
          run_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_allowances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_appraisal_ratings: {
        Row: {
          appraisal_type: string | null
          created_at: string
          date_start: string | null
          employee_id: string | null
          id: string
          rating: string | null
          remarks: string | null
          updated_at: string
        }
        Insert: {
          appraisal_type?: string | null
          created_at?: string
          date_start?: string | null
          employee_id?: string | null
          id?: string
          rating?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Update: {
          appraisal_type?: string | null
          created_at?: string
          date_start?: string | null
          employee_id?: string | null
          id?: string
          rating?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_appraisal_ratings_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          category: string
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          notes: string | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category: string
          document_type: string
          employee_id: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          notes?: string | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          category?: string
          document_type?: string
          employee_id?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          notes?: string | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_education: {
        Row: {
          created_at: string
          employee_id: string | null
          graduation_year: number | null
          id: string
          institute_name: string | null
          major: string | null
          qualification: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          graduation_year?: number | null
          id?: string
          institute_name?: string | null
          major?: string | null
          qualification?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          graduation_year?: number | null
          id?: string
          institute_name?: string | null
          major?: string | null
          qualification?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_education_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_family_members: {
        Row: {
          contact_number: string | null
          created_at: string
          date_of_birth: string | null
          employee_id: string | null
          id: string
          name: string
          notes: string | null
          relationship: string | null
          updated_at: string
        }
        Insert: {
          contact_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          employee_id?: string | null
          id?: string
          name: string
          notes?: string | null
          relationship?: string | null
          updated_at?: string
        }
        Update: {
          contact_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          employee_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          relationship?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_family_members_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_work_experience: {
        Row: {
          company_name: string | null
          created_at: string
          date_end: string | null
          date_start: string | null
          employee_id: string | null
          id: string
          job_title: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          employee_id?: string | null
          id?: string
          job_title?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          date_end?: string | null
          date_start?: string | null
          employee_id?: string | null
          id?: string
          job_title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_work_experience_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address_line_2: string | null
          address_type: string | null
          all_work_day: boolean | null
          allocation_account: string | null
          allocation_amount: number | null
          allocation_run: string | null
          allocation_type: string | null
          allowances: number | null
          annual_bonus_eligible: string | null
          assignment_date_start: string | null
          attendance_calendar: string | null
          badge_no: string | null
          bank_account: string | null
          bank_account_number: string | null
          bank_currency: string | null
          bank_name: string | null
          basic_salary: number | null
          beneficiary_name: string | null
          benefits_enrolled: string[] | null
          benefits_tier: string | null
          bonus_eligible: string | null
          city: string | null
          clock_area_codes: string[] | null
          clock_codes: string[] | null
          company: string | null
          confirmation_date: string | null
          contact_number: string | null
          contract_adjustment: number | null
          contract_date_start: string | null
          contract_end: string | null
          contract_nature: string | null
          contract_signed: boolean | null
          contract_start: string | null
          contract_type: string | null
          cost_center: string | null
          country_region: string | null
          cpf_account: string | null
          cpf_account_number: string | null
          cpf_contribution: boolean | null
          cpf_status: string | null
          cpf_submission_number: string | null
          created_at: string
          date_of_birth: string | null
          date_of_exit: string | null
          date_of_hire: string | null
          department: string | null
          disciplinary_flags: boolean | null
          email: string
          emergency_relationship: string | null
          employee_code: string | null
          employment_info_open_2: string | null
          employment_info_open_3: string | null
          employment_status: string | null
          employment_type: string | null
          exit_interview_date: string | null
          exit_reason: string | null
          extension_no: string | null
          first_name: string | null
          freeze_payment: boolean | null
          full_name: string
          funds: string | null
          gender: string | null
          gross_salary: number | null
          group_hospital_surgical_plan: string | null
          group_personal_accident_plan: string | null
          has_dependants: string | null
          hr_rpt_division_category: string | null
          hr_rpt_job_category: string | null
          id: string
          identity_no: string | null
          imei_uuid_no: string | null
          initial_join_date: string | null
          ir8a_required: string | null
          job_grade: string | null
          job_title: string | null
          join_date_for_leave: string | null
          last_name: string | null
          last_performance_review: string | null
          last_working_date: string | null
          last_working_day: string | null
          leave_balance: number | null
          leave_category: string | null
          leave_entitlement: number | null
          leave_grade: string | null
          local_name: string | null
          manager: string | null
          marital_status: string | null
          medical_entitlement: number | null
          membership_no: string | null
          middle_name: string | null
          mobile_no: string | null
          mom_bc_employee_group: string | null
          mom_bc_employee_type: string | null
          mom_bc_employment_type: string | null
          mom_bc_occupation_group: string | null
          mom_employee_type: string | null
          mom_occupation_group: string | null
          mom_status: string | null
          mso_scheme: string | null
          must_clock: boolean | null
          mvc_percentage: number | null
          nationality: string | null
          new_graduate: boolean | null
          no_of_children: number | null
          no_of_contracts: number | null
          no_of_contracts_total: number | null
          notes: string | null
          notice_period: number | null
          nric: string | null
          ns_group: string | null
          ns_status: string | null
          ot_eligible: string | null
          ot_group: string | null
          other_medical_benefit: string | null
          outpatient_medical_plan: string | null
          overtime_payment_period: string | null
          overtime_rate_of_pay: number | null
          paid_medical_examination_fee: boolean | null
          pay_group: string | null
          pay_mode: string | null
          payroll_cycle: string | null
          performance_score: number | null
          personal_email: string | null
          personal_info_open_1: string | null
          personal_mobile_no: string | null
          phone_number: string | null
          postal_code: string | null
          pr_issue_date: string | null
          pr_renounce_date: string | null
          previous_employee_code: string | null
          previous_work_experience: number | null
          probation_due: string | null
          probation_end: string | null
          probation_period: number | null
          probation_period_type: string | null
          profile_photo: string | null
          profile_picture: string | null
          qualification: string | null
          race: string | null
          recruitment_type: string | null
          rehire: boolean | null
          rehire_eligibility: string | null
          religion: string | null
          renewal: string | null
          reporting_manager: string | null
          residency_status: string | null
          resignation_date: string | null
          rest_day_per_week: string | null
          retire_age: number | null
          salary: number | null
          salary_arrears: number | null
          salary_currency: string | null
          salary_date_start: string | null
          salary_fixed: number | null
          salary_grade: string | null
          salary_gross: number | null
          service_length_adjustment: number | null
          service_length_total: number | null
          shorted_period: number | null
          shorted_period_type: string | null
          skill_set: string[] | null
          skillsfuture_eligible: string | null
          status_change_reason: string | null
          statutory_date_end: string | null
          statutory_date_start: string | null
          supervisor: string | null
          tax_file_no: string | null
          tax_identification_number: string | null
          tax_residency: string | null
          telephone_no: string | null
          thirteenth_month_entitlement: boolean | null
          title: string | null
          union_membership: string | null
          updated_at: string
          user_id: string
          vaccination_status: string | null
          web_role: string | null
          work_days_per_week: number | null
          work_days_per_year: number | null
          work_experience_to_date: number | null
          work_hours: number | null
          work_hours_per_day: number | null
          work_hours_per_year: number | null
          work_pass_expiry: string | null
          work_pass_expiry_date: string | null
          work_pass_number: string | null
          work_pass_type: string | null
          work_permit_number: string | null
        }
        Insert: {
          address_line_2?: string | null
          address_type?: string | null
          all_work_day?: boolean | null
          allocation_account?: string | null
          allocation_amount?: number | null
          allocation_run?: string | null
          allocation_type?: string | null
          allowances?: number | null
          annual_bonus_eligible?: string | null
          assignment_date_start?: string | null
          attendance_calendar?: string | null
          badge_no?: string | null
          bank_account?: string | null
          bank_account_number?: string | null
          bank_currency?: string | null
          bank_name?: string | null
          basic_salary?: number | null
          beneficiary_name?: string | null
          benefits_enrolled?: string[] | null
          benefits_tier?: string | null
          bonus_eligible?: string | null
          city?: string | null
          clock_area_codes?: string[] | null
          clock_codes?: string[] | null
          company?: string | null
          confirmation_date?: string | null
          contact_number?: string | null
          contract_adjustment?: number | null
          contract_date_start?: string | null
          contract_end?: string | null
          contract_nature?: string | null
          contract_signed?: boolean | null
          contract_start?: string | null
          contract_type?: string | null
          cost_center?: string | null
          country_region?: string | null
          cpf_account?: string | null
          cpf_account_number?: string | null
          cpf_contribution?: boolean | null
          cpf_status?: string | null
          cpf_submission_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          date_of_exit?: string | null
          date_of_hire?: string | null
          department?: string | null
          disciplinary_flags?: boolean | null
          email: string
          emergency_relationship?: string | null
          employee_code?: string | null
          employment_info_open_2?: string | null
          employment_info_open_3?: string | null
          employment_status?: string | null
          employment_type?: string | null
          exit_interview_date?: string | null
          exit_reason?: string | null
          extension_no?: string | null
          first_name?: string | null
          freeze_payment?: boolean | null
          full_name: string
          funds?: string | null
          gender?: string | null
          gross_salary?: number | null
          group_hospital_surgical_plan?: string | null
          group_personal_accident_plan?: string | null
          has_dependants?: string | null
          hr_rpt_division_category?: string | null
          hr_rpt_job_category?: string | null
          id?: string
          identity_no?: string | null
          imei_uuid_no?: string | null
          initial_join_date?: string | null
          ir8a_required?: string | null
          job_grade?: string | null
          job_title?: string | null
          join_date_for_leave?: string | null
          last_name?: string | null
          last_performance_review?: string | null
          last_working_date?: string | null
          last_working_day?: string | null
          leave_balance?: number | null
          leave_category?: string | null
          leave_entitlement?: number | null
          leave_grade?: string | null
          local_name?: string | null
          manager?: string | null
          marital_status?: string | null
          medical_entitlement?: number | null
          membership_no?: string | null
          middle_name?: string | null
          mobile_no?: string | null
          mom_bc_employee_group?: string | null
          mom_bc_employee_type?: string | null
          mom_bc_employment_type?: string | null
          mom_bc_occupation_group?: string | null
          mom_employee_type?: string | null
          mom_occupation_group?: string | null
          mom_status?: string | null
          mso_scheme?: string | null
          must_clock?: boolean | null
          mvc_percentage?: number | null
          nationality?: string | null
          new_graduate?: boolean | null
          no_of_children?: number | null
          no_of_contracts?: number | null
          no_of_contracts_total?: number | null
          notes?: string | null
          notice_period?: number | null
          nric?: string | null
          ns_group?: string | null
          ns_status?: string | null
          ot_eligible?: string | null
          ot_group?: string | null
          other_medical_benefit?: string | null
          outpatient_medical_plan?: string | null
          overtime_payment_period?: string | null
          overtime_rate_of_pay?: number | null
          paid_medical_examination_fee?: boolean | null
          pay_group?: string | null
          pay_mode?: string | null
          payroll_cycle?: string | null
          performance_score?: number | null
          personal_email?: string | null
          personal_info_open_1?: string | null
          personal_mobile_no?: string | null
          phone_number?: string | null
          postal_code?: string | null
          pr_issue_date?: string | null
          pr_renounce_date?: string | null
          previous_employee_code?: string | null
          previous_work_experience?: number | null
          probation_due?: string | null
          probation_end?: string | null
          probation_period?: number | null
          probation_period_type?: string | null
          profile_photo?: string | null
          profile_picture?: string | null
          qualification?: string | null
          race?: string | null
          recruitment_type?: string | null
          rehire?: boolean | null
          rehire_eligibility?: string | null
          religion?: string | null
          renewal?: string | null
          reporting_manager?: string | null
          residency_status?: string | null
          resignation_date?: string | null
          rest_day_per_week?: string | null
          retire_age?: number | null
          salary?: number | null
          salary_arrears?: number | null
          salary_currency?: string | null
          salary_date_start?: string | null
          salary_fixed?: number | null
          salary_grade?: string | null
          salary_gross?: number | null
          service_length_adjustment?: number | null
          service_length_total?: number | null
          shorted_period?: number | null
          shorted_period_type?: string | null
          skill_set?: string[] | null
          skillsfuture_eligible?: string | null
          status_change_reason?: string | null
          statutory_date_end?: string | null
          statutory_date_start?: string | null
          supervisor?: string | null
          tax_file_no?: string | null
          tax_identification_number?: string | null
          tax_residency?: string | null
          telephone_no?: string | null
          thirteenth_month_entitlement?: boolean | null
          title?: string | null
          union_membership?: string | null
          updated_at?: string
          user_id: string
          vaccination_status?: string | null
          web_role?: string | null
          work_days_per_week?: number | null
          work_days_per_year?: number | null
          work_experience_to_date?: number | null
          work_hours?: number | null
          work_hours_per_day?: number | null
          work_hours_per_year?: number | null
          work_pass_expiry?: string | null
          work_pass_expiry_date?: string | null
          work_pass_number?: string | null
          work_pass_type?: string | null
          work_permit_number?: string | null
        }
        Update: {
          address_line_2?: string | null
          address_type?: string | null
          all_work_day?: boolean | null
          allocation_account?: string | null
          allocation_amount?: number | null
          allocation_run?: string | null
          allocation_type?: string | null
          allowances?: number | null
          annual_bonus_eligible?: string | null
          assignment_date_start?: string | null
          attendance_calendar?: string | null
          badge_no?: string | null
          bank_account?: string | null
          bank_account_number?: string | null
          bank_currency?: string | null
          bank_name?: string | null
          basic_salary?: number | null
          beneficiary_name?: string | null
          benefits_enrolled?: string[] | null
          benefits_tier?: string | null
          bonus_eligible?: string | null
          city?: string | null
          clock_area_codes?: string[] | null
          clock_codes?: string[] | null
          company?: string | null
          confirmation_date?: string | null
          contact_number?: string | null
          contract_adjustment?: number | null
          contract_date_start?: string | null
          contract_end?: string | null
          contract_nature?: string | null
          contract_signed?: boolean | null
          contract_start?: string | null
          contract_type?: string | null
          cost_center?: string | null
          country_region?: string | null
          cpf_account?: string | null
          cpf_account_number?: string | null
          cpf_contribution?: boolean | null
          cpf_status?: string | null
          cpf_submission_number?: string | null
          created_at?: string
          date_of_birth?: string | null
          date_of_exit?: string | null
          date_of_hire?: string | null
          department?: string | null
          disciplinary_flags?: boolean | null
          email?: string
          emergency_relationship?: string | null
          employee_code?: string | null
          employment_info_open_2?: string | null
          employment_info_open_3?: string | null
          employment_status?: string | null
          employment_type?: string | null
          exit_interview_date?: string | null
          exit_reason?: string | null
          extension_no?: string | null
          first_name?: string | null
          freeze_payment?: boolean | null
          full_name?: string
          funds?: string | null
          gender?: string | null
          gross_salary?: number | null
          group_hospital_surgical_plan?: string | null
          group_personal_accident_plan?: string | null
          has_dependants?: string | null
          hr_rpt_division_category?: string | null
          hr_rpt_job_category?: string | null
          id?: string
          identity_no?: string | null
          imei_uuid_no?: string | null
          initial_join_date?: string | null
          ir8a_required?: string | null
          job_grade?: string | null
          job_title?: string | null
          join_date_for_leave?: string | null
          last_name?: string | null
          last_performance_review?: string | null
          last_working_date?: string | null
          last_working_day?: string | null
          leave_balance?: number | null
          leave_category?: string | null
          leave_entitlement?: number | null
          leave_grade?: string | null
          local_name?: string | null
          manager?: string | null
          marital_status?: string | null
          medical_entitlement?: number | null
          membership_no?: string | null
          middle_name?: string | null
          mobile_no?: string | null
          mom_bc_employee_group?: string | null
          mom_bc_employee_type?: string | null
          mom_bc_employment_type?: string | null
          mom_bc_occupation_group?: string | null
          mom_employee_type?: string | null
          mom_occupation_group?: string | null
          mom_status?: string | null
          mso_scheme?: string | null
          must_clock?: boolean | null
          mvc_percentage?: number | null
          nationality?: string | null
          new_graduate?: boolean | null
          no_of_children?: number | null
          no_of_contracts?: number | null
          no_of_contracts_total?: number | null
          notes?: string | null
          notice_period?: number | null
          nric?: string | null
          ns_group?: string | null
          ns_status?: string | null
          ot_eligible?: string | null
          ot_group?: string | null
          other_medical_benefit?: string | null
          outpatient_medical_plan?: string | null
          overtime_payment_period?: string | null
          overtime_rate_of_pay?: number | null
          paid_medical_examination_fee?: boolean | null
          pay_group?: string | null
          pay_mode?: string | null
          payroll_cycle?: string | null
          performance_score?: number | null
          personal_email?: string | null
          personal_info_open_1?: string | null
          personal_mobile_no?: string | null
          phone_number?: string | null
          postal_code?: string | null
          pr_issue_date?: string | null
          pr_renounce_date?: string | null
          previous_employee_code?: string | null
          previous_work_experience?: number | null
          probation_due?: string | null
          probation_end?: string | null
          probation_period?: number | null
          probation_period_type?: string | null
          profile_photo?: string | null
          profile_picture?: string | null
          qualification?: string | null
          race?: string | null
          recruitment_type?: string | null
          rehire?: boolean | null
          rehire_eligibility?: string | null
          religion?: string | null
          renewal?: string | null
          reporting_manager?: string | null
          residency_status?: string | null
          resignation_date?: string | null
          rest_day_per_week?: string | null
          retire_age?: number | null
          salary?: number | null
          salary_arrears?: number | null
          salary_currency?: string | null
          salary_date_start?: string | null
          salary_fixed?: number | null
          salary_grade?: string | null
          salary_gross?: number | null
          service_length_adjustment?: number | null
          service_length_total?: number | null
          shorted_period?: number | null
          shorted_period_type?: string | null
          skill_set?: string[] | null
          skillsfuture_eligible?: string | null
          status_change_reason?: string | null
          statutory_date_end?: string | null
          statutory_date_start?: string | null
          supervisor?: string | null
          tax_file_no?: string | null
          tax_identification_number?: string | null
          tax_residency?: string | null
          telephone_no?: string | null
          thirteenth_month_entitlement?: boolean | null
          title?: string | null
          union_membership?: string | null
          updated_at?: string
          user_id?: string
          vaccination_status?: string | null
          web_role?: string | null
          work_days_per_week?: number | null
          work_days_per_year?: number | null
          work_experience_to_date?: number | null
          work_hours?: number | null
          work_hours_per_day?: number | null
          work_hours_per_year?: number | null
          work_pass_expiry?: string | null
          work_pass_expiry_date?: string | null
          work_pass_number?: string | null
          work_pass_type?: string | null
          work_permit_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_reporting_manager_fkey"
            columns: ["reporting_manager"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          related_entity: string | null
          related_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          related_entity?: string | null
          related_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          related_entity?: string | null
          related_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      sync_employee_schema: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
