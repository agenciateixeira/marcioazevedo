import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  responses: {
    Row: {
      id: string
      created_at: string
      name: string
      email: string
      test_1_score: number
      test_2_score: number
      test_3_score: number
      total_score: number
      test_1_responses: Record<number, string>
      test_2_responses: Record<number, string>
      test_3_responses: Record<number, string>
      analysis: string
    }
    Insert: {
      id?: string
      created_at?: string
      name: string
      email: string
      test_1_score: number
      test_2_score: number
      test_3_score: number
      total_score: number
      test_1_responses: Record<number, string>
      test_2_responses: Record<number, string>
      test_3_responses: Record<number, string>
      analysis: string
    }
  }
}
