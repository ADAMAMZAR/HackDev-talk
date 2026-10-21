// Supabase client, set up the same way Lovable generates it.
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://brzqnzxeoummpyptdfiq.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_HLBrwPe_pLLxr8Ya_KfrrA_QDHvytmm'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

// Demo only: lets you run queries from the DevTools console.
// A real attacker doesn't need this. The URL and key above ship in the JS bundle.
window.supabase = supabase
