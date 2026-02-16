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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      api_rate_tracking: {
        Row: {
          call_count: number
          platform: Database["public"]["Enums"]["platform_type"]
          user_id: string
          window_start: string
        }
        Insert: {
          call_count?: number
          platform: Database["public"]["Enums"]["platform_type"]
          user_id: string
          window_start: string
        }
        Update: {
          call_count?: number
          platform?: Database["public"]["Enums"]["platform_type"]
          user_id?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "api_rate_tracking_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_plugs: {
        Row: {
          created_at: string
          fail_reason: string | null
          fired_at: string | null
          id: string
          platform: Database["public"]["Enums"]["platform_type"]
          plug_content: string
          plug_post_id: string | null
          post_id: string
          status: Database["public"]["Enums"]["plug_status"]
          trigger_type: Database["public"]["Enums"]["trigger_type"]
          trigger_value: number
        }
        Insert: {
          created_at?: string
          fail_reason?: string | null
          fired_at?: string | null
          id?: string
          platform: Database["public"]["Enums"]["platform_type"]
          plug_content: string
          plug_post_id?: string | null
          post_id: string
          status?: Database["public"]["Enums"]["plug_status"]
          trigger_type?: Database["public"]["Enums"]["trigger_type"]
          trigger_value: number
        }
        Update: {
          created_at?: string
          fail_reason?: string | null
          fired_at?: string | null
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          plug_content?: string
          plug_post_id?: string | null
          post_id?: string
          status?: Database["public"]["Enums"]["plug_status"]
          trigger_type?: Database["public"]["Enums"]["trigger_type"]
          trigger_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "auto_plugs_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      beta_codes: {
        Row: {
          code: string
          created_at: string | null
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beta_codes_used_by_fkey"
            columns: ["used_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_connections: {
        Row: {
          access_token: string
          created_at: string
          id: string
          is_active: boolean
          platform: Database["public"]["Enums"]["platform_type"]
          platform_handle: string
          platform_user_id: string
          refresh_token: string | null
          scopes: string[]
          token_expires_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          id?: string
          is_active?: boolean
          platform: Database["public"]["Enums"]["platform_type"]
          platform_handle: string
          platform_user_id: string
          refresh_token?: string | null
          scopes?: string[]
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          id?: string
          is_active?: boolean
          platform?: Database["public"]["Enums"]["platform_type"]
          platform_handle?: string
          platform_user_id?: string
          refresh_token?: string | null
          scopes?: string[]
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_targets: {
        Row: {
          comments_count: number
          fail_reason: string | null
          id: string
          last_polled_at: string | null
          likes_count: number
          platform: Database["public"]["Enums"]["platform_type"]
          platform_post_id: string | null
          platform_post_url: string | null
          post_id: string
          published_at: string | null
          reposts_count: number
        }
        Insert: {
          comments_count?: number
          fail_reason?: string | null
          id?: string
          last_polled_at?: string | null
          likes_count?: number
          platform: Database["public"]["Enums"]["platform_type"]
          platform_post_id?: string | null
          platform_post_url?: string | null
          post_id: string
          published_at?: string | null
          reposts_count?: number
        }
        Update: {
          comments_count?: number
          fail_reason?: string | null
          id?: string
          last_polled_at?: string | null
          likes_count?: number
          platform?: Database["public"]["Enums"]["platform_type"]
          platform_post_id?: string | null
          platform_post_url?: string | null
          post_id?: string
          published_at?: string | null
          reposts_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "post_targets_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          content: string
          created_at: string
          fail_reason: string | null
          id: string
          media_urls: string[]
          next_retry_at: string | null
          published_at: string | null
          retry_count: number
          scheduled_at: string | null
          status: Database["public"]["Enums"]["post_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          fail_reason?: string | null
          id?: string
          media_urls?: string[]
          next_retry_at?: string | null
          published_at?: string | null
          retry_count?: number
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          fail_reason?: string | null
          id?: string
          media_urls?: string[]
          next_retry_at?: string | null
          published_at?: string | null
          retry_count?: number
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          dodo_customer_id: string | null
          dodo_subscription_id: string | null
          email: string
          id: string
          is_beta_user: boolean
          name: string | null
          onboarding_step: number
          plan: Database["public"]["Enums"]["user_plan"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          email: string
          id: string
          is_beta_user?: boolean
          name?: string | null
          onboarding_step?: number
          plan?: Database["public"]["Enums"]["user_plan"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          dodo_customer_id?: string | null
          dodo_subscription_id?: string | null
          email?: string
          id?: string
          is_beta_user?: boolean
          name?: string | null
          onboarding_step?: number
          plan?: Database["public"]["Enums"]["user_plan"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_invite_code: { Args: { code_input: string }; Returns: boolean }
      get_dashboard_stats: { Args: never; Returns: Json }
    }
    Enums: {
      platform_type: "TWITTER"
      plug_status: "PENDING" | "FIRED" | "FAILED" | "SKIPPED"
      post_status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED"
      trigger_type: "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH"
      user_plan: "FREE" | "PRO" | "AGENCY"
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
      platform_type: ["TWITTER"],
      plug_status: ["PENDING", "FIRED", "FAILED", "SKIPPED"],
      post_status: ["DRAFT", "SCHEDULED", "PUBLISHING", "PUBLISHED", "FAILED"],
      trigger_type: ["LIKES", "COMMENTS", "REPOSTS", "TIME_AFTER_PUBLISH"],
      user_plan: ["FREE", "PRO", "AGENCY"],
    },
  },
} as const
