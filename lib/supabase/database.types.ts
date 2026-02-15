export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          plan: "FREE" | "PRO" | "AGENCY";
          onboarding_step: number;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          is_beta_user: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          plan?: "FREE" | "PRO" | "AGENCY";
          onboarding_step?: number;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          is_beta_user?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      beta_codes: {
        Row: {
          code: string;
          used_by: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          used_by?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["beta_codes"]["Insert"]>;
      };
      platform_connections: {
        Row: {
          id: string;
          user_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          platform_user_id: string;
          platform_handle: string;
          access_token: string;
          refresh_token: string | null;
          token_expires_at: string | null;
          scopes: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          platform_user_id: string;
          platform_handle: string;
          access_token: string;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          scopes?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["platform_connections"]["Insert"]>;
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          media_urls: string[];
          status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
          scheduled_at: string | null;
          published_at: string | null;
          retry_count: number;
          next_retry_at: string | null;
          fail_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          media_urls?: string[];
          status?: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
          scheduled_at?: string | null;
          published_at?: string | null;
          retry_count?: number;
          next_retry_at?: string | null;
          fail_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      post_targets: {
        Row: {
          id: string;
          post_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          platform_post_id: string | null;
          platform_post_url: string | null;
          bluesky_cid: string | null;
          likes_count: number;
          comments_count: number;
          reposts_count: number;
          last_polled_at: string | null;
          published_at: string | null;
          fail_reason: string | null;
        };
        Insert: {
          id?: string;
          post_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          platform_post_id?: string | null;
          platform_post_url?: string | null;
          bluesky_cid?: string | null;
          likes_count?: number;
          comments_count?: number;
          reposts_count?: number;
          last_polled_at?: string | null;
          published_at?: string | null;
          fail_reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["post_targets"]["Insert"]>;
      };
      auto_plugs: {
        Row: {
          id: string;
          post_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          plug_content: string;
          trigger_type: "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH";
          trigger_value: number;
          status: "PENDING" | "FIRED" | "FAILED" | "SKIPPED";
          fired_at: string | null;
          plug_post_id: string | null;
          fail_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          plug_content: string;
          trigger_type?: "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH";
          trigger_value: number;
          status?: "PENDING" | "FIRED" | "FAILED" | "SKIPPED";
          fired_at?: string | null;
          plug_post_id?: string | null;
          fail_reason?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["auto_plugs"]["Insert"]>;
      };
      api_rate_tracking: {
        Row: {
          user_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          window_start: string;
          call_count: number;
        };
        Insert: {
          user_id: string;
          platform: "TWITTER" | "LINKEDIN" | "BLUESKY";
          window_start: string;
          call_count?: number;
        };
        Update: Partial<Database["public"]["Tables"]["api_rate_tracking"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_dashboard_stats: {
        Args: { user_id_input: string };
        Returns: Json;
      };
    };
    Enums: {
      platform_type: "TWITTER" | "LINKEDIN" | "BLUESKY";
      post_status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
      plug_status: "PENDING" | "FIRED" | "FAILED" | "SKIPPED";
      trigger_type: "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH";
      user_plan: "FREE" | "PRO" | "AGENCY";
    };
    CompositeTypes: Record<string, never>;
  };
};
