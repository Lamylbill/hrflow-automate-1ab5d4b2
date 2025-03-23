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
      employees: {
        Row: {
          bank_account_number: string | null
          bank_name: string | null
          benefits_enrolled: string[] | null
          contract_signed: boolean | null
          cpf_account_number: string | null
          cpf_contribution: boolean | null
          created_at: string
          date_of_birth: string | null
          date_of_exit: string | null
          date_of_hire: string | null
          department: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_code: string | null
          employment_status: string | null
          employment_type: string | null
          full_name: string
          gender: string | null
          home_address: string | null
          id: string
          job_title: string | null
          last_performance_review: string | null
          leave_balance: number | null
          leave_entitlement: number | null
          medical_entitlement: number | null
          nationality: string | null
          notes: string | null
          performance_score: number | null
          phone_number: string | null
          postal_code: string | null
          probation_status: string | null
          profile_picture: string | null
          reporting_manager: string | null
          salary: number | null
          tax_identification_number: string | null
          updated_at: string
          user_id: string
          work_pass_expiry_date: string | null
          work_permit_number: string | null
        }
        Insert: {
          bank_account_number?: string | null
          bank_name?: string | null
          benefits_enrolled?: string[] | null
          contract_signed?: boolean | null
          cpf_account_number?: string | null
          cpf_contribution?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          date_of_exit?: string | null
          date_of_hire?: string | null
          department?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_code?: string | null
          employment_status?: string | null
          employment_type?: string | null
          full_name: string
          gender?: string | null
          home_address?: string | null
          id?: string
          job_title?: string | null
          last_performance_review?: string | null
          leave_balance?: number | null
          leave_entitlement?: number | null
          medical_entitlement?: number | null
          nationality?: string | null
          notes?: string | null
          performance_score?: number | null
          phone_number?: string | null
          postal_code?: string | null
          probation_status?: string | null
          profile_picture?: string | null
          reporting_manager?: string | null
          salary?: number | null
          tax_identification_number?: string | null
          updated_at?: string
          user_id: string
          work_pass_expiry_date?: string | null
          work_permit_number?: string | null
        }
        Update: {
          bank_account_number?: string | null
          bank_name?: string | null
          benefits_enrolled?: string[] | null
          contract_signed?: boolean | null
          cpf_account_number?: string | null
          cpf_contribution?: boolean | null
          created_at?: string
          date_of_birth?: string | null
          date_of_exit?: string | null
          date_of_hire?: string | null
          department?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_code?: string | null
          employment_status?: string | null
          employment_type?: string | null
          full_name?: string
          gender?: string | null
          home_address?: string | null
          id?: string
          job_title?: string | null
          last_performance_review?: string | null
          leave_balance?: number | null
          leave_entitlement?: number | null
          medical_entitlement?: number | null
          nationality?: string | null
          notes?: string | null
          performance_score?: number | null
          phone_number?: string | null
          postal_code?: string | null
          probation_status?: string | null
          profile_picture?: string | null
          reporting_manager?: string | null
          salary?: number | null
          tax_identification_number?: string | null
          updated_at?: string
          user_id?: string
          work_pass_expiry_date?: string | null
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
      [_ in never]: never
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
