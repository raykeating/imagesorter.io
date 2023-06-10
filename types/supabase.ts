export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Photos: {
        Row: {
          created_at: string | null
          id: number
          tag_id: number | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          tag_id?: number | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          tag_id?: number | null
          url?: string | null
          user_id?: string | null
        }
      }
      Tags: {
        Row: {
          created_at: string | null
          id: number
          tag_confidence: number | null
          tag_text: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          tag_confidence?: number | null
          tag_text?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          tag_confidence?: number | null
          tag_text?: string | null
        }
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
