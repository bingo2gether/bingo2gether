// TypeScript types auto-generated from Supabase schema
// Use in your frontend/backend with: import type { Database } from './types/supabase'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          couple_id: string
          details: Json | null
          goal_id: string | null
          id: string
          player: string | null
          timestamp: string | null
        }
        Insert: {
          activity_type: string
          couple_id: string
          details?: Json | null
          goal_id?: string | null
          id?: string
          player?: string | null
          timestamp?: string | null
        }
        Update: {
          activity_type?: string
          couple_id?: string
          details?: Json | null
          goal_id?: string | null
          id?: string
          player?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_log_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          }
        ]
      }
      bingo_numbers: {
        Row: {
          drawn_at: string | null
          drawn_by: string | null
          goal_id: string
          id: string
          is_drawn: boolean | null
          number: number
          value: number
          was_challenge: boolean | null
        }
        Insert: {
          drawn_at?: string | null
          drawn_by?: string | null
          goal_id: string
          id?: string
          is_drawn?: boolean | null
          number: number
          value: number
          was_challenge?: boolean | null
        }
        Update: {
          drawn_at?: string | null
          drawn_by?: string | null
          goal_id?: string
          id?: string
          is_drawn?: boolean | null
          number?: number
          value?: number
          was_challenge?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "bingo_numbers_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          }
        ]
      }
      couples: {
        Row: {
          brand_variant: string | null
          created_at: string | null
          id: string
          income_ratio: number
          is_pro: boolean | null
          player_1_id: string | null
          player_1_income: number
          player_1_name: string
          player_2_id: string | null
          player_2_income: number
          player_2_name: string
          weekly_ritual_day: number | null
        }
      }
      goals: {
        Row: {
          completed_at: string | null
          couple_id: string
          created_at: string | null
          current_amount: number | null
          description: string | null
          id: string
          is_primary: boolean | null
          status: string | null
          target_amount: number
          title: string
        }
      }
      draws: {
        Row: {
          challenge_id: string | null
          drawn_at: string | null
          drawn_by: string
          goal_id: string
          id: string
          number: number
          value: number
          was_challenge: boolean | null
        }
      }
      challenges: {
        Row: {
          challenge_data: Json
          challenge_type: string
          completed_at: string | null
          created_at: string | null
          goal_id: string
          id: string
          loser: string | null
          resulting_draw_id: string | null
          winner: string | null
        }
      }
      streaks: {
        Row: {
          couple_id: string
          current_streak: number | null
          freeze_count: number | null
          id: string
          is_in_difficult_months: boolean | null
          last_activity_date: string | null
          longest_streak: number | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
