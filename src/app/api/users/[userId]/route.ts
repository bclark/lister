import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createServerClientWithAuth } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/supabase';

// Helper function to get user ID from authorization header
async function getUserFromAuth(authHeader: string | null): Promise<{ userId: string; error?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { userId: '', error: 'Authorization header required' };
  }

  const token = authHeader.substring(7);

  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    // Mock authentication for development
    if (token === 'mock-access-token') {
      return { userId: 'mock-user-id' };
    } else {
      return { userId: '', error: 'Invalid token' };
    }
  }

  // Real Supabase authentication
  const supabase = createServerClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { userId: '', error: 'Invalid token' };
  }

  return { userId: data.user.id };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: targetUserId } = await params;
    const authHeader = request.headers.get('authorization');
    const { userId: currentUserId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const isOwnProfile = currentUserId === targetUserId;

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // In development mode, accept any user ID and return mock data
      const mockUser = {
        id: targetUserId,
        email: isOwnProfile ? 'test@example.com' : `user-${targetUserId.slice(0, 8)}@example.com`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: isOwnProfile ? 'testuser' : `user_${targetUserId.slice(0, 8)}`,
        is_own_profile: isOwnProfile,
      };

      return NextResponse.json({ user: mockUser });
    }

    // Real Supabase query
    // Note: For production, you might want to create a users table with public profiles
    // For now, we'll only allow users to view their own profile or return basic info
    
    if (isOwnProfile) {
      // Return current user's own profile
      const token = authHeader.substring(7);
      const supabase = createServerClientWithAuth(token);
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const userInfo = {
        id: userData.user.id,
        email: userData.user.email,
        created_at: userData.user.created_at,
        updated_at: userData.user.updated_at,
        username: userData.user.user_metadata?.username || null,
        is_own_profile: true,
      };

      return NextResponse.json({ user: userInfo });
    } else {
      // For other users, return limited public info
      // In a real app, you'd query a public users table
      const publicUserInfo = {
        id: targetUserId,
        email: null, // Don't expose other users' emails
        created_at: null,
        updated_at: null,
        username: `user_${targetUserId.slice(0, 8)}`,
        is_own_profile: false,
      };

      return NextResponse.json({ user: publicUserInfo });
    }

  } catch (error) {
    console.error('User info API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
