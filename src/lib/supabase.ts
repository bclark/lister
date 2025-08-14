import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we have valid Supabase credentials
const hasValidCredentials = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase client
export const supabase = hasValidCredentials 
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side Supabase client
export const createServerClient = () => {
  if (!hasValidCredentials) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};

// Server-side Supabase client with user session
export const createServerClientWithAuth = (accessToken: string) => {
  if (!hasValidCredentials) {
    throw new Error('Supabase credentials not configured');
  }
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
  
  return client;
};

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => hasValidCredentials;
