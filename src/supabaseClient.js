import { createClient } from '@supabase/supabase-js'

// Supabaseの接続情報は環境変数(.env)から読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
