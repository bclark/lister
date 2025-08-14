import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        database: isSupabaseConfigured() ? 'connected' : 'mock_mode',
        authentication: isSupabaseConfigured() ? 'supabase' : 'mock',
      },
      endpoints: {
        auth: {
          signin: '/api/auth/signin',
          signup: '/api/auth/signup',
          signout: '/api/auth/signout',
          me: '/api/auth/me',
        },
        categories: '/api/categories',
        lists: '/api/lists',
        health: '/api/health',
      },
    };

    return NextResponse.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 500 }
    );
  }
}
