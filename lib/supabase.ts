import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://geonzwrjnnuvuiecmdjx.supabase.co'

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdlb256d3Jqbm51dnVpZWNtZGp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMjI3NzYsImV4cCI6MjEwMjY5ODc3Nn0.cm9H5vt6XQxQlTIbnF0R74WO1AguCYf0fN5ZVy9IgCM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
