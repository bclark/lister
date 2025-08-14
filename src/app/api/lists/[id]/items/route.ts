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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listId } = await params;
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const { title, description, image_url, position } = await request.json();

    // Validate input
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Add item to mock list for development
      const listIndex = mockLists.findIndex(l => l.id === listId && l.user_id === userId);
      
      if (listIndex === -1) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }

      const list = mockLists[listIndex];
      
      // Check if list is full (max 10 items)
      if (list.items.length >= 10) {
        return NextResponse.json(
          { error: 'List is full (maximum 10 items)' },
          { status: 400 }
        );
      }

      const newItem = {
        id: `item-${Date.now()}`,
        list_id: listId,
        title,
        description: description || null,
        image_url: image_url || null,
        position: position || list.items.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // If position is specified, adjust other items
      if (position && position <= list.items.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        list.items = list.items.map((item: any) => ({
          ...item,
          position: item.position >= position ? item.position + 1 : item.position,
        }));
      }

      list.items.push(newItem);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      list.items.sort((a: any, b: any) => a.position - b.position);
      list.updated_at = new Date().toISOString();

      return NextResponse.json({ item: newItem }, { status: 201 });
    }

    // Real Supabase insert with authenticated user
    const token = authHeader!.substring(7);
    const supabase = createServerClientWithAuth(token);

    // First, check if the list exists and belongs to the user
    const { data: listData, error: listError } = await supabase
      .from('lists')
      .select('id, user_id')
      .eq('id', listId)
      .eq('user_id', userId)
      .single();

    if (listError || !listData) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    // Check current item count
    const { count, error: countError } = await supabase
      .from('list_items')
      .select('*', { count: 'exact', head: true })
      .eq('list_id', listId);

    if (countError) {
      console.error('Count error:', countError);
      return NextResponse.json(
        { error: 'Failed to check item count' },
        { status: 500 }
      );
    }

    if (count && count >= 10) {
      return NextResponse.json(
        { error: 'List is full (maximum 10 items)' },
        { status: 400 }
      );
    }

    // If position is not specified, use the next available position
    let itemPosition = position;
    if (!itemPosition) {
      itemPosition = (count || 0) + 1;
    }

    // If position is specified and conflicts, adjust other items
    if (position && position <= (count || 0)) {
      await supabase
        .from('list_items')
        .update({
          position: supabase.rpc('increment_position'),
          updated_at: new Date().toISOString(),
        })
        .eq('list_id', listId)
        .gte('position', position);
    }

    const { data, error } = await supabase
      .from('list_items')
      .insert({
        list_id: listId,
        title,
        description: description || null,
        image_url: image_url || null,
        position: itemPosition,
      })
      .select()
      .single();

    if (error) {
      console.error('Item creation error:', error);
      return NextResponse.json(
        { error: 'Failed to create item' },
        { status: 500 }
      );
    }

    // Update the list's updated_at timestamp
    await supabase
      .from('lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    return NextResponse.json({ item: data }, { status: 201 });

  } catch (error) {
    console.error('Item creation API error:', error);
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
    const { id: listId } = await params;
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const { items } = await request.json();

    // Validate input
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items array is required' },
        { status: 400 }
      );
    }

    if (items.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 items allowed' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Update mock list items for development
      const listIndex = mockLists.findIndex(l => l.id === listId && l.user_id === userId);
      
      if (listIndex === -1) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }

      const list = mockLists[listIndex];
      
      // Update positions
      list.items = items.map((item, index) => ({
        ...item,
        position: index + 1,
        updated_at: new Date().toISOString(),
      }));
      
      list.updated_at = new Date().toISOString();

      return NextResponse.json({ items: list.items });
    }

    // Real Supabase update with authenticated user
    const token = authHeader!.substring(7);
    const supabase = createServerClientWithAuth(token);

    // First, check if the list exists and belongs to the user
    const { data: listData, error: listError } = await supabase
      .from('lists')
      .select('id, user_id')
      .eq('id', listId)
      .eq('user_id', userId)
      .single();

    if (listError || !listData) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      );
    }

    // Update all items with new positions
    const updatePromises = items.map((item, index) =>
      supabase
        .from('list_items')
        .update({
          position: index + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', item.id)
        .eq('list_id', listId)
        .select()
        .single()
    );

    const results = await Promise.all(updatePromises);

    // Check for errors
    const errors = results.filter(result => result.error);
    if (errors.length > 0) {
      console.error('Item update errors:', errors);
      return NextResponse.json(
        { error: 'Failed to update items' },
        { status: 500 }
      );
    }

    // Update the list's updated_at timestamp
    await supabase
      .from('lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    const updatedItems = results.map(result => result.data).filter(Boolean);

    return NextResponse.json({ items: updatedItems });

  } catch (error) {
    console.error('Items reorder API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
