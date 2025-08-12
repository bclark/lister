'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Start with loading false

  useEffect(() => {
    console.log('AuthContext: Starting authentication setup');
    
    // For now, skip Supabase authentication to get the app working
    console.log('AuthContext: Skipping Supabase auth for now, using mock mode');
    setLoading(false);
    return;

    if (!isSupabaseConfigured()) {
      console.warn('AuthContext: Supabase not configured - using mock authentication');
      setLoading(false);
      return;
    }

    if (!supabase) {
      console.error('AuthContext: Supabase client is null');
      setLoading(false);
      return;
    }

    console.log('AuthContext: Supabase configured, getting initial session');

    // Get initial session with timeout
    const getSession = async () => {
      try {
        console.log('AuthContext: Fetching initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AuthContext: Error getting session:', error);
          setUser(null);
        } else {
          console.log('AuthContext: Session result:', session ? 'User logged in' : 'No session');
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('AuthContext: Exception getting session:', error);
        setUser(null);
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false);
      }
    };

    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      console.warn('AuthContext: Session fetch timeout, setting loading to false');
      setLoading(false);
    }, 5000);

    getSession().finally(() => {
      clearTimeout(timeoutId);
    });

    // Listen for auth changes
    console.log('AuthContext: Setting up auth state listener');
    const { data: { subscription } } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state change:', event, session ? 'User logged in' : 'No user');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthContext: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext: Sign in attempt for:', email);
    
    // Always use mock authentication for now
    console.log('AuthContext: Using mock sign in');
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      role: 'authenticated',
    };
    setUser(mockUser);
    return;

    if (!isSupabaseConfigured()) {
      console.log('AuthContext: Using mock sign in');
      // Mock sign in for development
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      };
      setUser(mockUser);
      return;
    }

    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      console.log('AuthContext: Sign in successful');
    } catch (error) {
      console.error('AuthContext: Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('AuthContext: Sign up attempt for:', email);
    
    // Always use mock authentication for now
    console.log('AuthContext: Using mock sign up');
    const mockUser: User = {
      id: 'mock-user-id',
      email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      role: 'authenticated',
    };
    setUser(mockUser);
    return;

    if (!isSupabaseConfigured()) {
      console.log('AuthContext: Using mock sign up');
      // Mock sign up for development
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        role: 'authenticated',
      };
      setUser(mockUser);
      return;
    }

    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      console.log('AuthContext: Sign up successful');
    } catch (error) {
      console.error('AuthContext: Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('AuthContext: Sign out attempt');
    
    // Always use mock authentication for now
    console.log('AuthContext: Using mock sign out');
    setUser(null);
    return;

    if (!isSupabaseConfigured()) {
      console.log('AuthContext: Using mock sign out');
      // Mock sign out for development
      setUser(null);
      return;
    }

    if (!supabase) {
      throw new Error('Supabase client not available');
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('AuthContext: Sign out successful');
    } catch (error) {
      console.error('AuthContext: Sign out error:', error);
      throw error;
    }
  };

  console.log('AuthContext: Current state - loading:', loading, 'user:', user ? 'logged in' : 'not logged in');

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
