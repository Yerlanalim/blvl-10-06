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
      lesson_steps: {
        Row: {
          content: string
          created_at: string
          id: string
          level_id: number
          order_index: number
          step_type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          level_id: number
          order_index: number
          step_type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          level_id?: number
          order_index?: number
          step_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_steps_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string
          description: string
          id: number
          order_index: number
          required_level: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id: number
          order_index: number
          required_level: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: number
          order_index?: number
          required_level?: number
          title?: string
        }
        Relationships: []
      }
      test_questions: {
        Row: {
          correct_answer: number
          created_at: string
          id: string
          lesson_step_id: string
          options: string[]
          question: string
          skill_category: string | null
        }
        Insert: {
          correct_answer: number
          created_at?: string
          id?: string
          lesson_step_id: string
          options: string[]
          question: string
          skill_category?: string | null
        }
        Update: {
          correct_answer?: number
          created_at?: string
          id?: string
          lesson_step_id?: string
          options?: string[]
          question?: string
          skill_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_lesson_step_id_fkey"
            columns: ["lesson_step_id"]
            isOneToOne: false
            referencedRelation: "lesson_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_artifacts: {
        Row: {
          file_id: string | null
          file_name: string
          file_path: string
          id: string
          level_id: number
          unlocked_at: string
          user_id: string
        }
        Insert: {
          file_id?: string | null
          file_name: string
          file_path: string
          id?: string
          level_id: number
          unlocked_at?: string
          user_id: string
        }
        Update: {
          file_id?: string | null
          file_name?: string
          file_path?: string
          id?: string
          level_id?: number
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_artifacts_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          ai_daily_reset_at: string
          ai_messages_count: number
          avatar_url: string | null
          completed_lessons: number[]
          created_at: string
          current_level: number
          display_name: string | null
          id: string
          tier_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_daily_reset_at?: string
          ai_messages_count?: number
          avatar_url?: string | null
          completed_lessons?: number[]
          created_at?: string
          current_level?: number
          display_name?: string | null
          id?: string
          tier_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_daily_reset_at?: string
          ai_messages_count?: number
          avatar_url?: string | null
          completed_lessons?: number[]
          created_at?: string
          current_level?: number
          display_name?: string | null
          id?: string
          tier_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          current_step: number
          id: string
          level_id: number
          test_scores: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_step?: number
          id?: string
          level_id: number
          test_scores?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_step?: number
          id?: string
          level_id?: number
          test_scores?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_level_id_fkey"
            columns: ["level_id"]
            isOneToOne: false
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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

// Educational platform specific types
export type Level = Tables<'levels'>
export type LessonStep = Tables<'lesson_steps'>
export type TestQuestion = Tables<'test_questions'>
export type UserProfile = Tables<'user_profiles'>
export type UserProgress = Tables<'user_progress'>
export type UserArtifact = Tables<'user_artifacts'>

export type StepType = 'text' | 'video' | 'test'
export type TierType = 'free' | 'paid'

// Helper types for the app
export interface LevelWithSteps extends Level {
  lesson_steps: LessonStep[]
}

export interface LessonStepWithQuestions extends LessonStep {
  test_questions?: TestQuestion[]
}

export interface UserProgressWithLevel extends UserProgress {
  level: Level
}

// Helper types for progress tracking
export interface LevelProgressDetails {
  current_step: number;
  total_steps: number;
  percentage: number;
}

export interface UserProgressResult {
  currentLevel: number;
  completedLevels: number[];
  tierType: TierType;
  aiMessagesCount: number;
  profile: UserProfile | null;
  progressByLevel: Record<number, LevelProgressDetails>;
}

export interface LevelAccessResult {
  canAccess: boolean;
  isLocked: boolean;
  reason?: string;
  level?: Level;
}
