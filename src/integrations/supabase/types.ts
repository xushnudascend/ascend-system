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
      ai_recommendations: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          next_step: string
          reason: string | null
          user_id: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          next_step: string
          reason?: string | null
          user_id: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          next_step?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      assessments: {
        Row: {
          created_at: string
          discipline_score: number
          dopamine_score: number
          fitness_score: number
          focus_score: number
          id: string
          money_score: number
          profile_type: string | null
          roadmap: string | null
          social_score: number
          strengths: string | null
          user_id: string
          weaknesses: string | null
        }
        Insert: {
          created_at?: string
          discipline_score?: number
          dopamine_score?: number
          fitness_score?: number
          focus_score?: number
          id?: string
          money_score?: number
          profile_type?: string | null
          roadmap?: string | null
          social_score?: number
          strengths?: string | null
          user_id: string
          weaknesses?: string | null
        }
        Update: {
          created_at?: string
          discipline_score?: number
          dopamine_score?: number
          fitness_score?: number
          focus_score?: number
          id?: string
          money_score?: number
          profile_type?: string | null
          roadmap?: string | null
          social_score?: number
          strengths?: string | null
          user_id?: string
          weaknesses?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          completed_days: number
          created_at: string
          duration_days: number
          ends_at: string | null
          id: string
          stake_xp: number
          started_at: string
          status: string
          target: string
          title: string
          user_id: string
        }
        Insert: {
          completed_days?: number
          created_at?: string
          duration_days?: number
          ends_at?: string | null
          id?: string
          stake_xp?: number
          started_at?: string
          status?: string
          target: string
          title: string
          user_id: string
        }
        Update: {
          completed_days?: number
          created_at?: string
          duration_days?: number
          ends_at?: string | null
          id?: string
          stake_xp?: number
          started_at?: string
          status?: string
          target?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string | null
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          name?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string | null
          type?: string
        }
        Relationships: []
      }
      course_progress: {
        Row: {
          completed: boolean
          course_id: string
          id: string
          lesson_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          course_id: string
          id?: string
          lesson_index?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          course_id?: string
          id?: string
          lesson_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_action_limits: {
        Row: {
          action_type: string
          count: number
          id: string
          log_date: string
          user_id: string
        }
        Insert: {
          action_type: string
          count?: number
          id?: string
          log_date?: string
          user_id: string
        }
        Update: {
          action_type?: string
          count?: number
          id?: string
          log_date?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_feedback: {
        Row: {
          adaptation: string | null
          analysis: string | null
          created_at: string
          feedback: string | null
          id: string
          input_summary: string | null
          log_date: string
          score: number | null
          user_id: string
        }
        Insert: {
          adaptation?: string | null
          analysis?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          input_summary?: string | null
          log_date?: string
          score?: number | null
          user_id: string
        }
        Update: {
          adaptation?: string | null
          analysis?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          input_summary?: string | null
          log_date?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      duels: {
        Row: {
          challenger_id: string
          challenger_score: number | null
          duration_days: number
          ends_at: string | null
          id: string
          opponent_id: string
          opponent_score: number | null
          started_at: string
          status: string
          target: string
          winner_id: string | null
        }
        Insert: {
          challenger_id: string
          challenger_score?: number | null
          duration_days?: number
          ends_at?: string | null
          id?: string
          opponent_id: string
          opponent_score?: number | null
          started_at?: string
          status?: string
          target: string
          winner_id?: string | null
        }
        Update: {
          challenger_id?: string
          challenger_score?: number | null
          duration_days?: number
          ends_at?: string | null
          id?: string
          opponent_id?: string
          opponent_score?: number | null
          started_at?: string
          status?: string
          target?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      excuses: {
        Row: {
          category: string | null
          counter: string | null
          created_at: string
          excuse_text: string
          id: string
          user_id: string
        }
        Insert: {
          category?: string | null
          counter?: string | null
          created_at?: string
          excuse_text: string
          id?: string
          user_id: string
        }
        Update: {
          category?: string | null
          counter?: string | null
          created_at?: string
          excuse_text?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      experiments: {
        Row: {
          after_score: number | null
          before_score: number | null
          description: string | null
          duration_days: number
          id: string
          notes: string | null
          started_at: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          after_score?: number | null
          before_score?: number | null
          description?: string | null
          duration_days?: number
          id?: string
          notes?: string | null
          started_at?: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          after_score?: number | null
          before_score?: number | null
          description?: string | null
          duration_days?: number
          id?: string
          notes?: string | null
          started_at?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      fail_log: {
        Row: {
          created_at: string
          id: string
          user_id: string
          what_failed: string
          xp_lost: number
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          what_failed: string
          xp_lost?: number
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          what_failed?: string
          xp_lost?: number
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed_at: string
          habit_id: string
          id: string
          log_date: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string
          habit_id: string
          id?: string
          log_date?: string
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string
          habit_id?: string
          id?: string
          log_date?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          completed: boolean
          created_at: string
          difficulty: number
          id: string
          last_completed_at: string | null
          name: string
          streak: number
          user_id: string
          xp_reward: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          difficulty?: number
          id?: string
          last_completed_at?: string | null
          name: string
          streak?: number
          user_id: string
          xp_reward?: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          difficulty?: number
          id?: string
          last_completed_at?: string | null
          name?: string
          streak?: number
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      health_logs: {
        Row: {
          created_at: string
          energy_level: number | null
          id: string
          log_date: string
          mood: string | null
          notes: string | null
          sleep_hours: number | null
          steps: number | null
          stress_level: number | null
          user_id: string
          water_glasses: number | null
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date?: string
          mood?: string | null
          notes?: string | null
          sleep_hours?: number | null
          steps?: number | null
          stress_level?: number | null
          user_id: string
          water_glasses?: number | null
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          energy_level?: number | null
          id?: string
          log_date?: string
          mood?: string | null
          notes?: string | null
          sleep_hours?: number | null
          steps?: number | null
          stress_level?: number | null
          user_id?: string
          water_glasses?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      life_scores: {
        Row: {
          body: number
          created_at: string
          discipline: number
          id: string
          log_date: string
          mind: number
          money: number
          purpose: number
          social: number
          user_id: string
        }
        Insert: {
          body?: number
          created_at?: string
          discipline?: number
          id?: string
          log_date?: string
          mind?: number
          money?: number
          purpose?: number
          social?: number
          user_id: string
        }
        Update: {
          body?: number
          created_at?: string
          discipline?: number
          id?: string
          log_date?: string
          mind?: number
          money?: number
          purpose?: number
          social?: number
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      micro_decisions: {
        Row: {
          answer: boolean
          category: string | null
          created_at: string
          id: string
          prompt: string
          user_id: string
        }
        Insert: {
          answer: boolean
          category?: string | null
          created_at?: string
          id?: string
          prompt: string
          user_id: string
        }
        Update: {
          answer?: boolean
          category?: string | null
          created_at?: string
          id?: string
          prompt?: string
          user_id?: string
        }
        Relationships: []
      }
      nutrition_logs: {
        Row: {
          calories: number
          carbs_g: number
          created_at: string
          fat_g: number
          goal: string
          id: string
          log_date: string
          notes: string | null
          protein_g: number
          user_id: string
        }
        Insert: {
          calories?: number
          carbs_g?: number
          created_at?: string
          fat_g?: number
          goal?: string
          id?: string
          log_date?: string
          notes?: string | null
          protein_g?: number
          user_id: string
        }
        Update: {
          calories?: number
          carbs_g?: number
          created_at?: string
          fat_g?: number
          goal?: string
          id?: string
          log_date?: string
          notes?: string | null
          protein_g?: number
          user_id?: string
        }
        Relationships: []
      }
      outputs: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          log_date: string
          title: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          log_date?: string
          title: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          log_date?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_adaptations: {
        Row: {
          created_at: string
          details: string | null
          direction: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          direction: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          details?: string | null
          direction?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          likes_count: number
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          addiction_level: string | null
          avatar_url: string | null
          bio: string | null
          country: string | null
          created_at: string
          discipline_score: number
          display_name: string | null
          energy_level: string | null
          goals: string | null
          id: string
          rank: string
          streak: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          addiction_level?: string | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          discipline_score?: number
          display_name?: string | null
          energy_level?: string | null
          goals?: string | null
          id?: string
          rank?: string
          streak?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          addiction_level?: string | null
          avatar_url?: string | null
          bio?: string | null
          country?: string | null
          created_at?: string
          discipline_score?: number
          display_name?: string | null
          energy_level?: string | null
          goals?: string | null
          id?: string
          rank?: string
          streak?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      root_causes: {
        Row: {
          category: string | null
          cause: string
          created_at: string
          failure: string
          id: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cause: string
          created_at?: string
          failure: string
          id?: string
          user_id: string
        }
        Update: {
          category?: string | null
          cause?: string
          created_at?: string
          failure?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_logs: {
        Row: {
          bedtime: string | null
          created_at: string
          hours: number | null
          id: string
          log_date: string
          quality: number | null
          user_id: string
          wake_time: string | null
        }
        Insert: {
          bedtime?: string | null
          created_at?: string
          hours?: number | null
          id?: string
          log_date?: string
          quality?: number | null
          user_id: string
          wake_time?: string | null
        }
        Update: {
          bedtime?: string | null
          created_at?: string
          hours?: number | null
          id?: string
          log_date?: string
          quality?: number | null
          user_id?: string
          wake_time?: string | null
        }
        Relationships: []
      }
      time_logs: {
        Row: {
          category: string
          created_at: string
          id: string
          label: string | null
          log_date: string
          minutes: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          label?: string | null
          log_date?: string
          minutes: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          label?: string | null
          log_date?: string
          minutes?: number
          user_id?: string
        }
        Relationships: []
      }
      transformations: {
        Row: {
          completed_at: string | null
          current_day: number
          id: string
          program_id: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_day?: number
          id?: string
          program_id: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_day?: number
          id?: string
          program_id?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      user_identity: {
        Row: {
          identity: string
          updated_at: string
          user_id: string
          votes: number
        }
        Insert: {
          identity: string
          updated_at?: string
          user_id: string
          votes?: number
        }
        Update: {
          identity?: string
          updated_at?: string
          user_id?: string
          votes?: number
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          email_reminders: boolean
          language: string
          reminder_hour: number
          telegram_chat_id: string | null
          telegram_reminders: boolean
          theme: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_reminders?: boolean
          language?: string
          reminder_hour?: number
          telegram_chat_id?: string | null
          telegram_reminders?: boolean
          theme?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_reminders?: boolean
          language?: string
          reminder_hour?: number
          telegram_chat_id?: string | null
          telegram_reminders?: boolean
          theme?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      war_room: {
        Row: {
          avoid: string | null
          created_at: string
          done: boolean
          enemy: string | null
          high_roi: string | null
          id: string
          log_date: string
          mission: string
          user_id: string
        }
        Insert: {
          avoid?: string | null
          created_at?: string
          done?: boolean
          enemy?: string | null
          high_roi?: string | null
          id?: string
          log_date?: string
          mission: string
          user_id: string
        }
        Update: {
          avoid?: string | null
          created_at?: string
          done?: boolean
          enemy?: string | null
          high_roi?: string | null
          id?: string
          log_date?: string
          mission?: string
          user_id?: string
        }
        Relationships: []
      }
      wins_wall: {
        Row: {
          body: string | null
          category: string | null
          created_at: string
          id: string
          is_public: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_public?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          exercise: string
          id: string
          log_date: string
          notes: string | null
          reps: number
          rpe: number | null
          sets: number
          split: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          exercise: string
          id?: string
          log_date?: string
          notes?: string | null
          reps?: number
          rpe?: number | null
          sets?: number
          split: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          exercise?: string
          id?: string
          log_date?: string
          notes?: string | null
          reps?: number
          rpe?: number | null
          sets?: number
          split?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_conv_participant: {
        Args: { _conv: string; _user: string }
        Returns: boolean
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
    Enums: {},
  },
} as const
