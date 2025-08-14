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

// Mock storage for development (in-memory)
let mockLists: any[] = [];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const categoryId = url.searchParams.get('category_id');
    const year = url.searchParams.get('year');

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Return mock lists for development
      let filteredLists = mockLists.filter(list => list.user_id === userId);
      
      if (categoryId) {
        filteredLists = filteredLists.filter(list => list.category_id === categoryId);
      }
      
      if (year) {
        filteredLists = filteredLists.filter(list => list.year === parseInt(year));
      }

      return NextResponse.json({ lists: filteredLists });
    }

    // Real Supabase query with authenticated user
    const token = authHeader.substring(7);
    const supabase = createServerClientWithAuth(token);
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
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

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
    const lists = data.map(list => ({
      ...list,
      items: (list.list_items || []).sort((a, b) => a.position - b.position),
    }));

    return NextResponse.json({ lists });

  } catch (error) {
    console.error('Lists API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const { category_id, year, title } = await request.json();

    // Validate input
    if (!category_id || !year) {
      return NextResponse.json(
        { error: 'Category ID and year are required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Create mock list for development
      const newList = {
        id: `list-${Date.now()}`,
        user_id: userId,
        category_id,
        year: parseInt(year),
        title: title || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        items: [],
      };

      // Check if list already exists for this user/category/year
      const existingList = mockLists.find(
        list => list.user_id === userId && 
                 list.category_id === category_id && 
                 list.year === parseInt(year)
      );

      if (existingList) {
        return NextResponse.json(
          { error: 'List already exists for this category and year' },
          { status: 409 }
        );
      }

      mockLists.push(newList);
      return NextResponse.json({ list: newList }, { status: 201 });
    }

    // Real Supabase insert with authenticated user
    const token = authHeader.substring(7);
    const supabase = createServerClientWithAuth(token);
    const { data, error } = await supabase
      .from('lists')
      .insert({
        user_id: userId,
        category_id,
        year: parseInt(year),
        title,
      })
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
      if (error.code === '23505') { // Unique constraint violation
        return NextResponse.json(
          { error: 'List already exists for this category and year' },
          { status: 409 }
        );
      }
      console.error('List creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create list' },
        { status: 500 }
      );
    }

    // Transform the data to match our List interface
    const list = {
      ...data,
      items: (data.list_items || []).sort((a, b) => a.position - b.position),
    };

    return NextResponse.json({ list }, { status: 201 });

  } catch (error) {
    console.error('List creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
