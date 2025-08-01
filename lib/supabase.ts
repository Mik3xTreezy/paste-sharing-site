import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Note: We're primarily using Prisma for database operations
// This Supabase client is available for additional features like:
// - Real-time subscriptions
// - File storage
// - Authentication (if we want to switch from NextAuth)
// - Row Level Security policies 