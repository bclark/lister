import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
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
let mockLists: any[] = [];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: listId, itemId } = await params;
    const authHeader = request.headers.get('authorization');
    const { userId, error: authError } = await getUserFromAuth(authHeader);

    if (authError) {
      return NextResponse.json(
        { error: authError },
        { status: 401 }
      );
    }

    const { title, description, image_url } = await request.json();

    // Validate input
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      // Update mock list item for development
      const listIndex = mockLists.findIndex(l => l.id === listId && l.user_id === userId);
      
      if (listIndex === -1) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }

      const list = mockLists[listIndex];
      const itemIndex = list.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      list.items[itemIndex] = {
        ...list.items[itemIndex],
        title,
        description: description || null,
        image_url: image_url || null,
        updated_at: new Date().toISOString(),
      };
      
      list.updated_at = new Date().toISOString();

      return NextResponse.json({ item: list.items[itemIndex] });
    }

    // Real Supabase update
    const supabase = createServerClient();

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

    const { data, error } = await supabase
      .from('list_items')
      .update({
        title,
        description: description || null,
        image_url: image_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .eq('list_id', listId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }
      console.error('Item update error:', error);
      return NextResponse.json(
        { error: 'Failed to update item' },
        { status: 500 }
      );
    }

    // Update the list's updated_at timestamp
    await supabase
      .from('lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    return NextResponse.json({ item: data });

  } catch (error) {
    console.error('Item update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  try {
    const { id: listId, itemId } = await params;
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
      // Delete mock list item for development
      const listIndex = mockLists.findIndex(l => l.id === listId && l.user_id === userId);
      
      if (listIndex === -1) {
        return NextResponse.json(
          { error: 'List not found' },
          { status: 404 }
        );
      }

      const list = mockLists[listIndex];
      const itemIndex = list.items.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        );
      }

      const deletedItem = list.items[itemIndex];
      list.items.splice(itemIndex, 1);
      
      // Re-adjust positions
      list.items = list.items.map((item, index) => ({
        ...item,
        position: index + 1,
        updated_at: new Date().toISOString(),
      }));
      
      list.updated_at = new Date().toISOString();

      return NextResponse.json({ message: 'Item deleted successfully' });
    }

    // Real Supabase delete
    const supabase = createServerClient();

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

    // Get the item to be deleted to know its position
    const { data: itemData, error: itemError } = await supabase
      .from('list_items')
      .select('position')
      .eq('id', itemId)
      .eq('list_id', listId)
      .single();

    if (itemError || !itemData) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Delete the item
    const { error: deleteError } = await supabase
      .from('list_items')
      .delete()
      .eq('id', itemId)
      .eq('list_id', listId);

    if (deleteError) {
      console.error('Item delete error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete item' },
        { status: 500 }
      );
    }

    // Adjust positions of remaining items
    await supabase
      .from('list_items')
      .update({
        position: supabase.rpc('decrement_position'),
        updated_at: new Date().toISOString(),
      })
      .eq('list_id', listId)
      .gt('position', itemData.position);

    // Update the list's updated_at timestamp
    await supabase
      .from('lists')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', listId);

    return NextResponse.json({ message: 'Item deleted successfully' });

  } catch (error) {
    console.error('Item delete API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
