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

// Mock storage for development (shared with main lists route)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockLists: any[] = [];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Return mock list for development
      const list = mockLists.find(l => l.id === id && l.user_id === userId);
      
      if (!list) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ list });
    }

    // Real Supabase query with authenticated user
    const token = authHeader!.substring(7);
    const supabase = createServerClientWithAuth(token);
    const { data, error } = await supabase
      .from('lists')
      .select(`
        *,
        list_items (
          id,
          title,
          description,
          image_url,
          position,
          created_at,
          updated_at
        ),
        categories (
          id,
          name,
          display_name,
          icon
        )
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }
      console.error('List fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch list' },
        { status: 500 }
      );
    }

    // Transform the data to match our List interface
    const list = {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: (data.list_items || []).sort((a: any, b: any) => a.position - b.position),
    };

    return NextResponse.json({ list });

  } catch (error) {
    console.error('List fetch API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const { title } = await request.json();

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Update mock list for development
      const listIndex = mockLists.findIndex(l => l.id === id && l.user_id === userId);
      
      if (listIndex === -1) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }

      mockLists[listIndex] = {
        ...mockLists[listIndex],
        title: title || null,
        updated_at: new Date().toISOString(),
      };

      return NextResponse.json({ list: mockLists[listIndex] });
    }

    // Real Supabase update with authenticated user
    const token = authHeader!.substring(7);
    const supabase = createServerClientWithAuth(token);
    const { data, error } = await supabase
      .from('lists')
      .update({
        title: title || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        list_items (
          id,
          title,
          description,
          image_url,
          position,
          created_at,
          updated_at
        ),
        categories (
          id,
          name,
          display_name,
          icon
        )
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }
      console.error('List update error:', error);
      return NextResponse.json(
        { error: 'Failed to update list' },
        { status: 500 }
      );
    }

    // Transform the data to match our List interface
    const list = {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: (data.list_items || []).sort((a: any, b: any) => a.position - b.position),
    };

    return NextResponse.json({ list });

  } catch (error) {
    console.error('List update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Delete mock list for development
      const listIndex = mockLists.findIndex(l => l.id === id && l.user_id === userId);
      
      if (listIndex === -1) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }

      mockLists.splice(listIndex, 1);
      return NextResponse.json({ message: 'List deleted successfully' });
    }

    // Real Supabase delete with authenticated user
    const token = authHeader!.substring(7);
    const supabase = createServerClientWithAuth(token);
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('List delete error:', error);
      return NextResponse.json(
        { error: 'Failed to delete list' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'List deleted successfully' });

  } catch (error) {
    console.error('List delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
