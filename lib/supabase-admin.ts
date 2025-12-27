import { createClient } from '@supabase/supabase-js'

// Cliente Supabase para operações administrativas
// Usa SERVICE_ROLE_KEY para bypassar RLS policies
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
