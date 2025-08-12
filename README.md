# Lister - Annual Top 10 List Curator

A modern web application for creating, organizing, and sharing annual top 10 lists of your favorite items. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Secure sign-up and sign-in with Supabase Auth
- **Category Selection**: Choose from various categories like movies, songs, books, games, etc.
- **Drag & Drop Lists**: Intuitive drag-and-drop interface for reordering items
- **List Management**: Add, remove, and reorder items with a maximum of 10 items per list
- **Sharing Capabilities**: Export lists as text or images for social media sharing
- **Responsive Design**: Beautiful, modern UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, API)
- **Drag & Drop**: @dnd-kit (React 19 compatible)
- **Icons**: Lucide React
- **Image Generation**: html2canvas (for future image export feature)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lister
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase:
   - Create a new Supabase project
   - Get your project URL and anon key from the project settings
   - Add the SQL schema (see Database Schema section below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Schema

You'll need to set up the following tables in Supabase:

### Users Table
```sql
-- This is handled automatically by Supabase Auth
-- No additional setup needed
```

### Categories Table
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

### Lists Table
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

### List Items Table
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

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with AuthProvider
│   ├── page.tsx           # Landing page with auth forms
│   └── list-builder/      # Main list builder page
│       └── page.tsx
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── categories/        # Category selection components
│   ├── lists/             # List management components
│   └── sharing/           # Sharing functionality components
├── contexts/               # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                    # Utility libraries
│   └── supabase.ts        # Supabase client configuration
└── types/                  # TypeScript type definitions
    └── index.ts
```

## API Endpoints

The application is designed to work with Supabase's auto-generated REST API. Future versions will include:

- Custom API routes for advanced functionality
- Webhook support for external integrations
- Rate limiting and caching

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Future Enhancements

- [ ] Image export functionality with html2canvas
- [ ] Public list sharing and discovery
- [ ] Social features (likes, comments, follows)
- [ ] Mobile app using React Native
- [ ] Advanced analytics and insights
- [ ] Integration with external APIs (Spotify, IMDB, etc.)
- [ ] Dark mode support
- [ ] Internationalization (i18n)
