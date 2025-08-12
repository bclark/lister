# Setup Guide for Lister

## Quick Start (Development Mode)

The application is currently running in development mode with mock authentication. You can:

1. **Test the UI**: Navigate to `http://localhost:3000` to see the landing page
2. **Try Authentication**: Use any email/password combination to sign in/up
3. **Build Lists**: Create and manage your top 10 lists with drag-and-drop functionality

## Setting Up Supabase (Production)

To use real authentication and data persistence:

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization and enter project details
5. Wait for the project to be created

### 2. Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Set Up Database Schema

Run these SQL commands in your Supabase SQL Editor:

#### Categories Table
```sql
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, display_name, description, icon) VALUES
  ('movie', 'Movie', 'Your favorite films of the year', '🎬'),
  ('song', 'Song', 'Your top tracks of the year', '🎵'),
  ('comic', 'Comic Book', 'Your favorite comics of the year', '📚'),
  ('tv-show', 'TV Show', 'Your top television series of the year', '📺'),
  ('book', 'Book', 'Your favorite books of the year', '📖'),
  ('game', 'Video Game', 'Your top games of the year', '🎮');
```

#### Lists Table
```sql
CREATE TABLE lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  year INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, year)
);

-- Enable RLS
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own lists" ON lists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lists" ON lists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists" ON lists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists" ON lists
  FOR DELETE USING (auth.uid() = user_id);
```

#### List Items Table
```sql
CREATE TABLE list_items (
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

-- Enable RLS
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view items from their own lists" ON list_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items to their own lists" ON list_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items from their own lists" ON list_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items from their own lists" ON list_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()
    )
  );
```

### 4. Restart the Application

After setting up the environment variables:

```bash
# Stop the current dev server (Ctrl+C)
# Then restart
npm run dev
```

## Features Available

### Current Features
- ✅ User authentication (mock in dev, real with Supabase)
- ✅ Category selection
- ✅ Drag-and-drop list management
- ✅ Add/remove items
- ✅ List reordering
- ✅ Maximum 10 items per list
- ✅ Responsive design
- ✅ Share functionality (text copy)

### Coming Soon
- 🔄 Image export with html2canvas
- 🔄 Real-time collaboration
- 🔄 Public list sharing
- 🔄 Social features

## Troubleshooting

### Common Issues

1. **"Supabase not configured" warning**: This is normal in development mode
2. **Authentication not working**: Check your `.env.local` file and restart the server
3. **Database errors**: Ensure you've run the SQL schema setup
4. **Build errors**: Make sure all dependencies are installed with `npm install`

### Development vs Production

- **Development**: Uses mock authentication, no data persistence
- **Production**: Requires Supabase setup for full functionality

## Next Steps

1. Test the application in development mode
2. Set up Supabase when ready for production
3. Customize categories and features as needed
4. Deploy to your preferred hosting platform
