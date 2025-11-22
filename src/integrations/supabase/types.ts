export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blacklist: {
        Row: {
          blacklisted_at: string
          blacklisted_by: string | null
          id: string
          id_number: string | null
          plate_number: string | null
          reason: string
          removed_at: string | null
          visitor_name: string | null
        }
        Insert: {
          blacklisted_at?: string
          blacklisted_by?: string | null
          id?: string
          id_number?: string | null
          plate_number?: string | null
          reason: string
          removed_at?: string | null
          visitor_name?: string | null
        }
        Update: {
          blacklisted_at?: string
          blacklisted_by?: string | null
          id?: string
          id_number?: string | null
          plate_number?: string | null
          reason?: string
          removed_at?: string | null
          visitor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blacklist_blacklisted_by_fkey"
            columns: ["blacklisted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_notes: {
        Row: {
          exit_log_id: string | null
          file_name: string
          file_url: string
          id: string
          request_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          exit_log_id?: string | null
          file_name: string
          file_url: string
          id?: string
          request_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          exit_log_id?: string | null
          file_name?: string
          file_url?: string
          id?: string
          request_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_notes_exit_log_id_fkey"
            columns: ["exit_log_id"]
            isOneToOne: false
            referencedRelation: "entry_exit_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_notes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "visitor_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_notes_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      entry_exit_logs: {
        Row: {
          created_at: string
          entry_time: string | null
          exit_time: string | null
          id: string
          logged_by: string | null
          notes: string | null
          request_id: string
        }
        Insert: {
          created_at?: string
          entry_time?: string | null
          exit_time?: string | null
          id?: string
          logged_by?: string | null
          notes?: string | null
          request_id: string
        }
        Update: {
          created_at?: string
          entry_time?: string | null
          exit_time?: string | null
          id?: string
          logged_by?: string | null
          notes?: string | null
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entry_exit_logs_logged_by_fkey"
            columns: ["logged_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entry_exit_logs_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "visitor_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          department: Database["public"]["Enums"]["department_type"] | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: Database["public"]["Enums"]["department_type"] | null
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      request_documents: {
        Row: {
          document_type: string
          file_name: string
          file_url: string
          id: string
          request_id: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          file_name: string
          file_url: string
          id?: string
          request_id: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          file_name?: string
          file_url?: string
          id?: string
          request_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_documents_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "visitor_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_requests: {
        Row: {
          company_name: string
          created_at: string
          department_approved_at: string | null
          department_approved_by: string | null
          department_remarks: string | null
          department_to_visit: Database["public"]["Enums"]["department_type"]
          full_name: string
          has_vehicle: boolean
          id: string
          id_number: string
          nationality: string
          parking_slot_available: boolean | null
          plant_location: Database["public"]["Enums"]["plant_location"] | null
          plate_number: string | null
          purpose_of_visit: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          security_approved_at: string | null
          security_approved_by: string | null
          security_remarks: string | null
          status: Database["public"]["Enums"]["approval_status"]
          submitted_at: string
          truck_operation: Database["public"]["Enums"]["truck_operation"] | null
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"] | null
          visit_end_date: string | null
          visit_start_date: string | null
        }
        Insert: {
          company_name: string
          created_at?: string
          department_approved_at?: string | null
          department_approved_by?: string | null
          department_remarks?: string | null
          department_to_visit: Database["public"]["Enums"]["department_type"]
          full_name: string
          has_vehicle?: boolean
          id?: string
          id_number: string
          nationality: string
          parking_slot_available?: boolean | null
          plant_location?: Database["public"]["Enums"]["plant_location"] | null
          plate_number?: string | null
          purpose_of_visit: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          security_approved_at?: string | null
          security_approved_by?: string | null
          security_remarks?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          submitted_at?: string
          truck_operation?:
            | Database["public"]["Enums"]["truck_operation"]
            | null
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"] | null
          visit_end_date?: string | null
          visit_start_date?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string
          department_approved_at?: string | null
          department_approved_by?: string | null
          department_remarks?: string | null
          department_to_visit?: Database["public"]["Enums"]["department_type"]
          full_name?: string
          has_vehicle?: boolean
          id?: string
          id_number?: string
          nationality?: string
          parking_slot_available?: boolean | null
          plant_location?: Database["public"]["Enums"]["plant_location"] | null
          plate_number?: string | null
          purpose_of_visit?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          security_approved_at?: string | null
          security_approved_by?: string | null
          security_remarks?: string | null
          status?: Database["public"]["Enums"]["approval_status"]
          submitted_at?: string
          truck_operation?:
            | Database["public"]["Enums"]["truck_operation"]
            | null
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"] | null
          visit_end_date?: string | null
          visit_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitor_requests_department_approved_by_fkey"
            columns: ["department_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitor_requests_rejected_by_fkey"
            columns: ["rejected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitor_requests_security_approved_by_fkey"
            columns: ["security_approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_blacklisted: {
        Args: { p_id_number?: string; p_plate_number?: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "department_admin" | "security_admin"
      approval_status:
        | "pending_department"
        | "pending_security"
        | "approved"
        | "rejected"
      department_type:
        | "shipping"
        | "raw_material"
        | "lab"
        | "coordinator"
        | "bulk_oil"
      plant_location: "jeddah" | "riyadh"
      truck_operation: "loading" | "unloading" | "both"
      vehicle_type: "truck" | "car" | "none"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["department_admin", "security_admin"],
      approval_status: [
        "pending_department",
        "pending_security",
        "approved",
        "rejected",
      ],
      department_type: [
        "shipping",
        "raw_material",
        "lab",
        "coordinator",
        "bulk_oil",
      ],
      plant_location: ["jeddah", "riyadh"],
      truck_operation: ["loading", "unloading", "both"],
      vehicle_type: ["truck", "car", "none"],
    },
  },
} as const
