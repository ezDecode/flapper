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
          dodo_customer_id: string | null;
          dodo_subscription_id: string | null;
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
          dodo_customer_id?: string | null;
          dodo_subscription_id?: string | null;
          is_beta_user?: boolean;
          created_at?: string;
          updated_at?: string;
        };

        Relationships: [];
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

        Relationships: [];
      };
      platform_connections: {
        Row: {
          id: string;
          user_id: string;
          platform: "TWITTER";
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
          platform: "TWITTER";
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

        Relationships: [];
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

        Relationships: [];
      };
      post_targets: {
        Row: {
          id: string;
          post_id: string;
          platform: "TWITTER";
          platform_post_id: string | null;
          platform_post_url: string | null;
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
          platform: "TWITTER";
          platform_post_id?: string | null;
          platform_post_url?: string | null;
          likes_count?: number;
          comments_count?: number;
          reposts_count?: number;
          last_polled_at?: string | null;
          published_at?: string | null;
          fail_reason?: string | null;
        };

        Relationships: [];
      };
      auto_plugs: {
        Row: {
          id: string;
          post_id: string;
          platform: "TWITTER";
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
          platform: "TWITTER";
          plug_content: string;
          trigger_type?: "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH";
          trigger_value: number;
          status?: "PENDING" | "FIRED" | "FAILED" | "SKIPPED";
          fired_at?: string | null;
          plug_post_id?: string | null;
          fail_reason?: string | null;
          created_at?: string;
        };

        Relationships: [];
      };
      api_rate_tracking: {
        Row: {
          user_id: string;
          platform: "TWITTER";
          window_start: string;
          call_count: number;
        };
        Insert: {
          user_id: string;
          platform: "TWITTER";
          window_start: string;
          call_count?: number;
        };

        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_dashboard_stats: {
        Args: Record<string, never>;
        Returns: Json;
      };
    };
    Enums: {
      platform_type: "TWITTER";
      post_status: "DRAFT" | "SCHEDULED" | "PUBLISHING" | "PUBLISHED" | "FAILED";
      plug_status: "PENDING" | "FIRED" | "FAILED" | "SKIPPED";
      trigger_type: "LIKES" | "COMMENTS" | "REPOSTS" | "TIME_AFTER_PUBLISH";
      user_plan: "FREE" | "PRO" | "AGENCY";
    };
    CompositeTypes: Record<string, never>;
  };
};

