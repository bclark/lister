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
// Note: This is intentionally unused in this file, but kept for consistency

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

    const url = new URL(request.url);
    const categoryId = url.searchParams.get('category_id');
    const year = url.searchParams.get('year');
    const includePrivate = url.searchParams.get('include_private') === 'true';

    // Check if requesting own lists or has permission to view other user's lists
    const isOwnLists = currentUserId === targetUserId;
    const canViewPrivate = isOwnLists || includePrivate;

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // In development mode, we'll use localStorage-like mock data
      // For any user ID, return some sample lists
      let mockUserLists = [
        {
          id: `list-${targetUserId}-1`,
          user_id: targetUserId,
          category_id: 'cat-1',
          year: 2023,
          title: `${isOwnLists ? 'My' : 'User\'s'} Top Movies 2023`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [
            {
              id: `item-${targetUserId}-1`,
              list_id: `list-${targetUserId}-1`,
              title: 'The Matrix',
              description: 'A computer hacker learns about reality',
              image_url: null,
              position: 1,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          ],
          categories: {
            id: 'cat-1',
            name: 'movie',
            display_name: 'Movie',
            icon: '🎬'
          }
        },
        {
          id: `list-${targetUserId}-2`,
          user_id: targetUserId,
          category_id: 'cat-2',
          year: 2023,
          title: `${isOwnLists ? 'My' : 'User\'s'} Top Songs 2023`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          items: [],
          categories: {
            id: 'cat-2',
            name: 'song',
            display_name: 'Song',
            icon: '🎵'
          }
        }
      ];
      
      // Apply filters
      if (categoryId) {
        mockUserLists = mockUserLists.filter(list => list.category_id === categoryId);
      }
      
      if (year) {
        mockUserLists = mockUserLists.filter(list => list.year === parseInt(year));
      }

      return NextResponse.json({ 
        lists: mockUserLists,
        user_id: targetUserId,
        is_own_lists: isOwnLists,
        user_email: isOwnLists ? 'test@example.com' : `user-${targetUserId.slice(0, 8)}@example.com`
      });
    }

    // Real Supabase query with authenticated user
    const token = authHeader!.substring(7);
    const supabase = createServerClientWithAuth(token);
    
    // For production, you might want to add user validation
    // For now, we'll trust that the user ID is valid and let the query handle it

    let query = supabase
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
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    // If not own lists and not explicitly requesting private, filter by public lists
    // Note: You'll need to add an 'is_public' column to your lists table for this to work
    // For now, we'll assume all lists are viewable if you have a valid token
    if (!canViewPrivate) {
      // query = query.eq('is_public', true);
      // For now, we'll allow viewing all lists if authenticated
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (year) {
      query = query.eq('year', parseInt(year));
    }

    const { data, error } = await query;

    if (error) {
      console.error('Lists fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch lists' },
        { status: 500 }
      );
    }

    // Transform the data to match our List interface
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lists = data.map((list: any) => ({
      ...list,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      items: (list.list_items || []).sort((a: any, b: any) => a.position - b.position),
    }));

    return NextResponse.json({ 
      lists,
      user_id: targetUserId,
      is_own_lists: isOwnLists,
      user_email: isOwnLists ? 'Current User' : `User ${targetUserId.slice(0, 8)}`
    });

  } catch (error) {
    console.error('User lists API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
