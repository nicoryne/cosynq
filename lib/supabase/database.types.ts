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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_telemetry: {
        Row: {
          created_at: string | null
          deactivated_at: string | null
          id: string
          updated_at: string | null
          username_last_changed_at: string | null
        }
        Insert: {
          created_at?: string | null
          deactivated_at?: string | null
          id: string
          updated_at?: string | null
          username_last_changed_at?: string | null
        }
        Update: {
          created_at?: string | null
          deactivated_at?: string | null
          id?: string
          updated_at?: string | null
          username_last_changed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "account_telemetry_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cosplan_assets: {
        Row: {
          asset_type: Database["public"]["Enums"]["cosplan_asset_type"] | null
          cosplan_id: string
          created_at: string | null
          id: string
          public_id: string | null
          url: string
        }
        Insert: {
          asset_type?: Database["public"]["Enums"]["cosplan_asset_type"] | null
          cosplan_id: string
          created_at?: string | null
          id?: string
          public_id?: string | null
          url: string
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["cosplan_asset_type"] | null
          cosplan_id?: string
          created_at?: string | null
          id?: string
          public_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "cosplan_assets_cosplan_id_fkey"
            columns: ["cosplan_id"]
            isOneToOne: false
            referencedRelation: "cosplans"
            referencedColumns: ["id"]
          },
        ]
      }
      cosplan_budget_items: {
        Row: {
          cosplan_id: string
          cost: number | null
          created_at: string | null
          id: string
          item_name: string
          status: string | null
        }
        Insert: {
          cosplan_id: string
          cost?: number | null
          created_at?: string | null
          id?: string
          item_name: string
          status?: string | null
        }
        Update: {
          cosplan_id?: string
          cost?: number | null
          created_at?: string | null
          id?: string
          item_name?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cosplan_budget_items_cosplan_id_fkey"
            columns: ["cosplan_id"]
            isOneToOne: false
            referencedRelation: "cosplans"
            referencedColumns: ["id"]
          },
        ]
      }
      cosplan_measurements: {
        Row: {
          cosplan_id: string
          created_at: string | null
          id: string
          label: string
          unit: string | null
          value: string
        }
        Insert: {
          cosplan_id: string
          created_at?: string | null
          id?: string
          label: string
          unit?: string | null
          value: string
        }
        Update: {
          cosplan_id?: string
          created_at?: string | null
          id?: string
          label?: string
          unit?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "cosplan_measurements_cosplan_id_fkey"
            columns: ["cosplan_id"]
            isOneToOne: false
            referencedRelation: "cosplans"
            referencedColumns: ["id"]
          },
        ]
      }
      cosplan_swatches: {
        Row: {
          cosplan_id: string
          created_at: string | null
          hex_code: string
          id: string
          label: string | null
        }
        Insert: {
          cosplan_id: string
          created_at?: string | null
          hex_code: string
          id?: string
          label?: string | null
        }
        Update: {
          cosplan_id?: string
          created_at?: string | null
          hex_code?: string
          id?: string
          label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cosplan_swatches_cosplan_id_fkey"
            columns: ["cosplan_id"]
            isOneToOne: false
            referencedRelation: "cosplans"
            referencedColumns: ["id"]
          },
        ]
      }
      cosplan_tasks: {
        Row: {
          category: string | null
          cosplan_id: string
          created_at: string | null
          id: string
          is_completed: boolean | null
          position: number | null
          title: string
        }
        Insert: {
          category?: string | null
          cosplan_id: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          position?: number | null
          title: string
        }
        Update: {
          category?: string | null
          cosplan_id?: string
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          position?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cosplan_tasks_cosplan_id_fkey"
            columns: ["cosplan_id"]
            isOneToOne: false
            referencedRelation: "cosplans"
            referencedColumns: ["id"]
          },
        ]
      }
      cosplans: {
        Row: {
          budget_ceiling: number | null
          character_name: string
          created_at: string | null
          deadline: string | null
          id: string
          notes: Json | null
          owner_id: string
          series: string
          status: Database["public"]["Enums"]["cosplan_status"] | null
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          budget_ceiling?: number | null
          character_name: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          notes?: Json | null
          owner_id: string
          series: string
          status?: Database["public"]["Enums"]["cosplan_status"] | null
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          budget_ceiling?: number | null
          character_name?: string
          created_at?: string | null
          deadline?: string | null
          id?: string
          notes?: Json | null
          owner_id?: string
          series?: string
          status?: Database["public"]["Enums"]["cosplan_status"] | null
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cosplans_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          actor_id: string | null
          content: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          read_at: string | null
          recipient_id: string
          type: string
        }
        Insert: {
          actor_id?: string | null
          content?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          read_at?: string | null
          recipient_id: string
          type: string
        }
        Update: {
          actor_id?: string | null
          content?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          read_at?: string | null
          recipient_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_audit_log: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: number
          new_role: Database["public"]["Enums"]["app_role"]
          old_role: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_role: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          user_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_role?: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_public_id: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          facebook_url: string
          id: string
          location: string | null
          updated_at: string
          username: string
          website: string | null
        }
        Insert: {
          avatar_public_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          facebook_url: string
          id: string
          location?: string | null
          updated_at?: string
          username: string
          website?: string | null
        }
        Update: {
          avatar_public_id?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          facebook_url?: string
          id?: string
          location?: string | null
          updated_at?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_email_exists: { Args: { lookup_email: string }; Returns: boolean }
      check_facebook_url_exists: {
        Args: { lookup_url: string }
        Returns: boolean
      }
      check_username_exists: {
        Args: { lookup_username: string }
        Returns: boolean
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      delete_old_notifications: { Args: never; Returns: undefined }
    }
    Enums: {
      app_role: "user" | "moderator" | "admin"
      cosplan_asset_type: "REFERENCE" | "PROGRESS" | "FINAL"
      cosplan_status:
        | "DREAMING"
        | "PLANNING"
        | "IN_PROGRESS"
        | "ALMOST_DONE"
        | "ASCENDED"
        | "STASIS"
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
      app_role: ["user", "moderator", "admin"],
      cosplan_asset_type: ["REFERENCE", "PROGRESS", "FINAL"],
      cosplan_status: [
        "DREAMING",
        "PLANNING",
        "IN_PROGRESS",
        "ALMOST_DONE",
        "ASCENDED",
        "STASIS",
      ],
    },
  },
} as const
