-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories (only if table is empty)
INSERT INTO categories (name, display_name, description, icon)
SELECT 'movie', 'Movie', 'Your favorite films of the year', '🎬'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'movie');

INSERT INTO categories (name, display_name, description, icon)
SELECT 'song', 'Song', 'Your top tracks of the year', '🎵'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'song');

INSERT INTO categories (name, display_name, description, icon)
SELECT 'comic', 'Comic Book', 'Your favorite comics of the year', '📚'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'comic');

INSERT INTO categories (name, display_name, description, icon)
SELECT 'tv-show', 'TV Show', 'Your top television series of the year', '📺'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'tv-show');

INSERT INTO categories (name, display_name, description, icon)
SELECT 'book', 'Book', 'Your favorite books of the year', '📖'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'book');

INSERT INTO categories (name, display_name, description, icon)
SELECT 'game', 'Video Game', 'Your top games of the year', '🎮'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'game');

-- Lists Table
CREATE TABLE IF NOT EXISTS lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, year)
);

-- Enable RLS on lists
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Create policies for lists
DROP POLICY IF EXISTS "Users can view their own lists" ON lists;
CREATE POLICY "Users can view their own lists" ON lists
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own lists" ON lists;
CREATE POLICY "Users can insert their own lists" ON lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own lists" ON lists;
CREATE POLICY "Users can update their own lists" ON lists
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own lists" ON lists;
CREATE POLICY "Users can delete their own lists" ON lists
  FOR DELETE USING (auth.uid() = user_id);

-- List Items Table
CREATE TABLE IF NOT EXISTS list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  list_id UUID REFERENCES lists(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, position)
);

-- Enable RLS on list_items
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

-- Create policies for list_items
DROP POLICY IF EXISTS "Users can view items from their own lists" ON list_items;
CREATE POLICY "Users can view items from their own lists" ON list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert items to their own lists" ON list_items;
CREATE POLICY "Users can insert items to their own lists" ON list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update items from their own lists" ON list_items;
CREATE POLICY "Users can update items from their own lists" ON list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete items from their own lists" ON list_items;
CREATE POLICY "Users can delete items from their own lists" ON list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lists_user_id ON lists(user_id);
CREATE INDEX IF NOT EXISTS idx_lists_category_year ON lists(category_id, year);
CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_list_items_position ON list_items(list_id, position);
