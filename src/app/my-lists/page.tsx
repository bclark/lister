'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { List, Category } from '@/types';
import { listStore } from '@/lib/listStore';
import { Star, Plus, Trash2, ArrowLeft } from 'lucide-react';

// Mock data - replace with actual API calls
const mockCategories: Category[] = [
  {
    id: '1',
    name: 'movie',
    display_name: 'Movie',
    description: 'Your favorite films of the year',
    icon: '🎬',
    sub_genres: [
      { id: '1-1', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '1-2', name: 'sci-fi', display_name: 'Sci-Fi', icon: '🚀' },
      { id: '1-3', name: 'action', display_name: 'Action', icon: '💥' },
      { id: '1-4', name: 'comedy', display_name: 'Comedy', icon: '😂' },
      { id: '1-5', name: 'drama', display_name: 'Drama', icon: '🎭' },
      { id: '1-6', name: 'thriller', display_name: 'Thriller', icon: '😱' },
      { id: '1-7', name: 'romance', display_name: 'Romance', icon: '💕' },
      { id: '1-8', name: 'documentary', display_name: 'Documentary', icon: '📹' },
      { id: '1-9', name: 'animation', display_name: 'Animation', icon: '🎨' },
      { id: '1-10', name: 'fantasy', display_name: 'Fantasy', icon: '🐉' }
    ]
  },
  {
    id: '2',
    name: 'song',
    display_name: 'Song',
    description: 'Your top tracks of the year',
    icon: '🎵',
    sub_genres: [
      { id: '2-1', name: 'pop', display_name: 'Pop', icon: '🎤' },
      { id: '2-2', name: 'rock', display_name: 'Rock', icon: '🎸' },
      { id: '2-3', name: 'hip-hop', display_name: 'Hip-Hop', icon: '🎧' },
      { id: '2-4', name: 'electronic', display_name: 'Electronic', icon: '🎛️' },
      { id: '2-5', name: 'country', display_name: 'Country', icon: '🤠' },
      { id: '2-6', name: 'jazz', display_name: 'Jazz', icon: '🎷' },
      { id: '2-7', name: 'classical', display_name: 'Classical', icon: '🎻' },
      { id: '2-8', name: 'r&b', display_name: 'R&B', icon: '🎹' },
      { id: '2-9', name: 'indie', display_name: 'Indie', icon: '🎪' },
      { id: '2-10', name: 'folk', display_name: 'Folk', icon: '🪕' }
    ]
  },
  {
    id: '3',
    name: 'comic',
    display_name: 'Comic Book',
    description: 'Your favorite comics of the year',
    icon: '📚',
    sub_genres: [
      { id: '3-1', name: 'superhero', display_name: 'Superhero', icon: '🦸' },
      { id: '3-2', name: 'manga', display_name: 'Manga', icon: '🗾' },
      { id: '3-3', name: 'graphic-novel', display_name: 'Graphic Novel', icon: '📖' },
      { id: '3-4', name: 'webcomic', display_name: 'Webcomic', icon: '💻' },
      { id: '3-5', name: 'indie-comic', display_name: 'Indie Comic', icon: '🎨' },
      { id: '3-6', name: 'horror-comic', display_name: 'Horror Comic', icon: '👻' },
      { id: '3-7', name: 'sci-fi-comic', display_name: 'Sci-Fi Comic', icon: '🚀' },
      { id: '3-8', name: 'fantasy-comic', display_name: 'Fantasy Comic', icon: '🐉' },
      { id: '3-9', name: 'slice-of-life', display_name: 'Slice of Life', icon: '☕' },
      { id: '3-10', name: 'crime-comic', display_name: 'Crime Comic', icon: '🕵️' }
    ]
  },
  {
    id: '4',
    name: 'tv-show',
    display_name: 'TV Show',
    description: 'Your top television series of the year',
    icon: '📺',
    sub_genres: [
      { id: '4-1', name: 'drama', display_name: 'Drama', icon: '🎭' },
      { id: '4-2', name: 'comedy', display_name: 'Comedy', icon: '😂' },
      { id: '4-3', name: 'sci-fi', display_name: 'Sci-Fi', icon: '🚀' },
      { id: '4-4', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '4-5', name: 'thriller', display_name: 'Thriller', icon: '😱' },
      { id: '4-6', name: 'reality', display_name: 'Reality TV', icon: '📺' },
      { id: '4-7', name: 'documentary', display_name: 'Documentary', icon: '📹' },
      { id: '4-8', name: 'animation', display_name: 'Animation', icon: '🎨' },
      { id: '4-9', name: 'crime', display_name: 'Crime', icon: '🕵️' },
      { id: '4-10', name: 'fantasy', display_name: 'Fantasy', icon: '🐉' }
    ]
  },
  {
    id: '5',
    name: 'book',
    display_name: 'Book',
    description: 'Your favorite books of the year',
    icon: '📖',
    sub_genres: [
      { id: '5-1', name: 'fiction', display_name: 'Fiction', icon: '📚' },
      { id: '5-2', name: 'non-fiction', display_name: 'Non-Fiction', icon: '📖' },
      { id: '5-3', name: 'mystery', display_name: 'Mystery', icon: '🕵️' },
      { id: '5-4', name: 'romance', display_name: 'Romance', icon: '💕' },
      { id: '5-5', name: 'fantasy', display_name: 'Fantasy', icon: '🐉' },
      { id: '5-6', name: 'sci-fi', display_name: 'Sci-Fi', icon: '🚀' },
      { id: '5-7', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '5-8', name: 'biography', display_name: 'Biography', icon: '👤' },
      { id: '5-9', name: 'self-help', display_name: 'Self-Help', icon: '💪' },
      { id: '5-10', name: 'poetry', display_name: 'Poetry', icon: '✍️' }
    ]
  },
  {
    id: '6',
    name: 'game',
    display_name: 'Video Game',
    description: 'Your top games of the year',
    icon: '🎮',
    sub_genres: [
      { id: '6-1', name: 'action', display_name: 'Action', icon: '💥' },
      { id: '6-2', name: 'rpg', display_name: 'RPG', icon: '⚔️' },
      { id: '6-3', name: 'strategy', display_name: 'Strategy', icon: '🧠' },
      { id: '6-4', name: 'adventure', display_name: 'Adventure', icon: '🗺️' },
      { id: '6-5', name: 'sports', display_name: 'Sports', icon: '⚽' },
      { id: '6-6', name: 'racing', display_name: 'Racing', icon: '🏎️' },
      { id: '6-7', name: 'puzzle', display_name: 'Puzzle', icon: '🧩' },
      { id: '6-8', name: 'horror', display_name: 'Horror', icon: '👻' },
      { id: '6-9', name: 'indie', display_name: 'Indie', icon: '🎪' },
      { id: '6-10', name: 'multiplayer', display_name: 'Multiplayer', icon: '🎮' }
    ]
  },
];

export default function MyListsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lists, setLists] = useState<List[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Add a refresh function
  const refreshLists = useCallback(() => {
    if (user) {
      const userLists = listStore.getLists(user.id);
      setLists(userLists);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Load user's lists from storage
    refreshLists();
  }, [user, router, refreshLists]);

  // Refresh lists when the page becomes visible (e.g., when returning from list builder)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        refreshLists();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, refreshLists]);

  // Also refresh when the page gains focus
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        refreshLists();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, refreshLists]);

  const getCategoryInfo = (categoryId: string) => {
    return mockCategories.find(cat => cat.id === categoryId);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = getCategoryInfo(categoryId);
    return category?.icon || '📋';
  };

  const getCategoryName = (categoryId: string) => {
    const category = getCategoryInfo(categoryId);
    return category?.display_name || 'Unknown';
  };

  const getDisplayTitle = (title?: string) => {
    // Extract sub-genre name from titles like "My Top Action Movies of 2025"
    if (title && title.includes('My Top ') && title.includes(' of ')) {
      const subGenre = title.replace('My Top ', '').split(' ').slice(0, -3).join(' ');
      return subGenre;
    }
    return title || 'Untitled List';
  };

  const getDisplayYear = (title?: string, listYear?: number) => {
    // Extract year from title or use list year
    if (title && title.includes(' of ')) {
      const yearMatch = title.match(/of (\d{4})/);
      return yearMatch ? yearMatch[1] : listYear;
    }
    return listYear;
  };

  const handleCreateNewList = () => {
    router.push('/list-builder');
  };

  const handleEditList = (list: List) => {
    // Navigate to list builder with this list pre-loaded
    router.push(`/list-builder?listId=${list.id}`);
  };

  const handleDeleteList = (listId: string) => {
    if (confirm('Are you sure you want to delete this list? This action cannot be undone.')) {
      listStore.deleteList(listId);
      // Update local state
      setLists(lists.filter(list => list.id !== listId));
    }
  };

  const filteredLists = lists.filter(list => list.year === selectedYear);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{background: 'var(--gradient-secondary)'}}>
      {/* Header */}
      <header className="relative overflow-hidden shadow-2xl border-b-2" style={{
        backgroundColor: 'var(--primary-dark)',
        borderBottomColor: 'var(--border)'
      }}>
        <div className="absolute inset-0" style={{background: 'var(--gradient-accent)', opacity: 0.1}}></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:h-20 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => router.push('/list-builder')}
                className="p-2 sm:p-3 transition-all duration-200 flex-shrink-0 border rounded-none hover:shadow-lg"
                style={{
                  color: 'var(--background)',
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--border-light)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--background-secondary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(139, 115, 85, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--background)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.backgroundColor = 'var(--border-light)';
                }}
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
              </button>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  {/* Circular radar-like element */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-none relative" style={{borderColor: 'var(--border)'}}>
                    <div className="absolute inset-1 border rounded-none" style={{borderColor: 'var(--border-light)'}}></div>
                    <div className="absolute inset-2 rounded-none" style={{backgroundColor: 'var(--border-light)'}}></div>
                    <Star className="absolute inset-0 m-auto h-4 w-4 sm:h-5 sm:w-5" style={{color: 'var(--border)'}} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-xl font-bold truncate font-mono tracking-widest" style={{color: 'var(--background-secondary)'}}>
                    ARCHIVE.LISTS
                  </h1>
                  <div className="text-xs font-mono" style={{color: 'rgba(196, 181, 160, 0.7)'}}>SYSTEM.ONLINE</div>
                </div>
              </div>
            </div>
            {/* Status indicators */}
            <div className="flex items-center gap-2">
              <div className="text-xs font-mono" style={{color: 'var(--background)'}}>STATUS: ACTIVE</div>
              <div className="w-2 h-2 rounded-none animate-pulse" style={{backgroundColor: 'var(--border)'}}></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-8 sm:pt-16">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 animate-slide-in-up relative">
          {/* HUD-style corner brackets */}
          <div className="relative inline-block">
            <div className="absolute -top-4 -left-4 w-8 h-8 border-l-2 border-t-2" style={{borderColor: 'var(--border)'}}></div>
            <div className="absolute -top-4 -right-4 w-8 h-8 border-r-2 border-t-2" style={{borderColor: 'var(--border)'}}></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-l-2 border-b-2" style={{borderColor: 'var(--border)'}}></div>
            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-r-2 border-b-2" style={{borderColor: 'var(--border)'}}></div>
            
            <div className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 mb-6 sm:mb-8 border backdrop-blur-sm relative" style={{
              backgroundColor: 'rgba(61, 51, 39, 0.8)',
              borderColor: 'var(--border-light)'
            }}>
              {/* Radar sweep animation */}
              <div className="w-6 h-6 border-2 rounded-none relative overflow-hidden" style={{borderColor: 'var(--border)'}}>
                <div className="absolute inset-0" style={{backgroundColor: 'var(--border-light)'}}></div>
                <div className="absolute top-1/2 left-1/2 w-0.5 h-3 origin-bottom transform -translate-x-1/2 -translate-y-full animate-spin" style={{backgroundColor: 'var(--border)'}}></div>
              </div>
              <span className="font-medium text-sm sm:text-base font-mono tracking-wider" style={{color: 'var(--background)'}}>NOSTROMO.ARCHIVE // DATA.REPOSITORY.ACCESSED</span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-mono tracking-widest relative" style={{color: 'var(--background-secondary)'}}>
            COLLECTION.DB
            {/* Underline with dots */}
            <div className="flex justify-center mt-2">
              <div className="flex gap-1">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 h-1 rounded-none" style={{backgroundColor: 'var(--border)'}}></div>
                ))}
              </div>
            </div>
          </h2>
          
          <div className="flex justify-center items-center gap-4 font-mono text-sm sm:text-base" style={{color: 'rgba(196, 181, 160, 0.7)'}}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none animate-pulse" style={{backgroundColor: 'var(--border)'}}></div>
              <span>SYSTEM.READY</span>
            </div>
            <div className="w-px h-4" style={{backgroundColor: 'var(--border-light)'}}></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-none" style={{backgroundColor: 'var(--primary)'}}></div>
              <span>CONN.STABLE</span>
            </div>
          </div>
        </div>

        {/* Year Filter and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative">
          {/* Left side controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border rotate-45" style={{borderColor: 'var(--border)'}}></div>
              <label className="text-base sm:text-lg font-semibold font-mono tracking-wide" style={{color: 'var(--background)'}}>TEMPORAL.FILTER</label>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 sm:px-4 py-2 border-2 rounded-none focus:outline-none focus:ring-2 backdrop-blur-sm text-sm sm:text-base font-mono appearance-none pr-8"
                  style={{
                    borderColor: 'var(--border-light)',
                    backgroundColor: 'rgba(61, 51, 39, 0.9)',
                    color: 'var(--background)'
                  }}
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year} style={{backgroundColor: 'var(--primary-dark)', color: 'var(--background)'}}>{year}</option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent" style={{borderTopColor: 'var(--border)'}}></div>
                </div>
              </div>
              <button
                onClick={refreshLists}
                className="p-2 sm:px-3 sm:py-2 border-2 rounded-none transition-all duration-200 relative group"
                style={{
                  borderColor: 'var(--border-light)',
                  color: 'var(--border)',
                  backgroundColor: 'var(--border-light)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(139, 115, 85, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--border)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.backgroundColor = 'var(--border-light)';
                }}
                title="Refresh lists"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right side button */}
          <div className="relative w-full sm:w-auto">
            {/* Corner brackets for button */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2" style={{borderColor: 'var(--border)'}}></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2" style={{borderColor: 'var(--border)'}}></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2" style={{borderColor: 'var(--border)'}}></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2" style={{borderColor: 'var(--border)'}}></div>
            
            <button
              onClick={handleCreateNewList}
              className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 rounded-none transition-all duration-300 font-bold shadow-lg w-full sm:w-auto text-sm sm:text-base font-mono tracking-widest border-2 relative overflow-hidden"
              style={{
                background: 'var(--gradient-primary)',
                color: 'var(--background-secondary)',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-glow)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gradient-secondary)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(139, 115, 85, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--gradient-primary)';
                e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
              }}
            >
              {/* Scanning line effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Plus size={18} className="sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">INIT.NEW.COLLECTION</span>
            </button>
          </div>
        </div>

        {/* Lists Grid */}
        {filteredLists.length === 0 ? (
          <div className="text-center py-12 sm:py-16 relative">
            {/* Radar-style empty state */}
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8">
              {/* Outer circles */}
              <div className="absolute inset-0 border-2 rounded-none" style={{borderColor: 'rgba(139, 115, 85, 0.3)'}}></div>
              <div className="absolute inset-4 border rounded-none" style={{borderColor: 'rgba(139, 115, 85, 0.5)'}}></div>
              <div className="absolute inset-8 border rounded-none" style={{borderColor: 'rgba(139, 115, 85, 0.7)'}}></div>
              
              {/* Center dot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-none transform -translate-x-1/2 -translate-y-1/2" style={{backgroundColor: 'var(--border)'}}></div>
              
              {/* Sweeping line */}
              <div className="absolute top-1/2 left-1/2 w-0.5 h-16 sm:h-20 origin-bottom transform -translate-x-1/2 -translate-y-full animate-spin" style={{backgroundColor: 'var(--border)'}}></div>
              
              {/* Cross lines */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5" style={{backgroundColor: 'rgba(139, 115, 85, 0.3)'}}></div>
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5" style={{backgroundColor: 'rgba(139, 115, 85, 0.3)'}}></div>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold mb-2 font-mono tracking-wide" style={{color: 'var(--primary-dark)'}}>NO.DATA.DETECTED // {selectedYear}</h3>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 px-4 sm:px-0 font-mono" style={{color: 'rgba(61, 51, 39, 0.6)'}}>&gt; INITIALIZE.FIRST.COLLECTION.PROTOCOL</p>
            
            <div className="relative inline-block">
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2" style={{borderColor: 'var(--border)'}}></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2" style={{borderColor: 'var(--border)'}}></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2" style={{borderColor: 'var(--border)'}}></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2" style={{borderColor: 'var(--border)'}}></div>
              
              <button
                onClick={handleCreateNewList}
                className="group flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-none transition-all duration-300 font-bold shadow-lg text-sm sm:text-base font-mono tracking-widest border-2 relative overflow-hidden"
                style={{
                  background: 'var(--gradient-accent)',
                  color: 'var(--background-secondary)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow-glow)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <Plus size={18} className="sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">INIT.FIRST.COLLECTION</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list, index) => (
              <div
                key={list.id}
                onClick={() => handleEditList(list)}
                className="group backdrop-blur-sm border-2 rounded-none p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-in-up cursor-pointer relative overflow-hidden"
                style={{
                  backgroundColor: 'rgba(61, 51, 39, 0.9)',
                  borderColor: 'rgba(139, 115, 85, 0.4)',
                  boxShadow: 'var(--shadow-glow)',
                  animationDelay: `${index * 0.1}s`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow-dark)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139, 115, 85, 0.4)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
              >
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l border-t" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                <div className="absolute top-2 right-2 w-3 h-3 border-r border-t" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l border-b" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r border-b" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                
                {/* Scanning line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-pulse" style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(139, 115, 85, 0.1), transparent)'}}></div>
                
                {/* List Header */}
                <div className="flex items-start justify-between mb-4 relative">
                  <div className="flex items-center gap-3">
                    {/* HUD-style icon container */}
                    <div className="relative">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-none flex items-center justify-center text-lg sm:text-xl font-bold shadow-lg border" style={{background: 'var(--gradient-primary)', color: 'var(--primary-dark)', borderColor: 'var(--border)'}}>
                        {getCategoryIcon(list.category_id)}
                      </div>
                      {/* Small status indicator */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-none border" style={{backgroundColor: 'var(--accent)', borderColor: 'var(--primary-dark)'}}></div>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-base sm:text-lg group-hover:transition-colors duration-300 font-mono tracking-wider mb-1" style={{color: 'var(--background)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--background-secondary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--background)'}>
                        {getDisplayTitle(list.title).toUpperCase()}
                      </h3>
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-mono" style={{color: 'rgba(196, 181, 160, 0.8)'}}>
                        <div className="w-2 h-2 rounded-none" style={{backgroundColor: 'var(--border)'}}></div>
                        <span>{getCategoryName(list.category_id)}</span>
                      </div>
                      <div className="text-xs mt-1 font-mono" style={{color: 'rgba(196, 181, 160, 0.6)'}}>
                        TEMPORAL.ID: {getDisplayYear(list.title, list.year)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical readout section */}
                <div className="mb-4 relative border p-3" style={{borderColor: 'rgba(139, 115, 85, 0.2)', backgroundColor: 'rgba(139, 115, 85, 0.1)'}}>
                  <div className="flex items-center justify-between text-xs font-mono mb-2" style={{color: 'rgba(196, 181, 160, 0.7)'}}>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-none" style={{backgroundColor: 'var(--border)'}}></div>
                      <span>YEAR.{list.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>DATA.ENTRIES</span>
                      <div className="px-2 py-1 border font-bold" style={{backgroundColor: 'rgba(139, 115, 85, 0.2)', borderColor: 'rgba(139, 115, 85, 0.4)', color: 'var(--background)'}}>
                        {list.items.length}/10
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar with segments */}
                  <div className="w-full h-3 border relative" style={{backgroundColor: 'rgba(61, 51, 39, 0.5)', borderColor: 'rgba(139, 115, 85, 0.3)'}}>
                    <div 
                      className="h-full transition-all duration-300 relative"
                      style={{background: 'var(--gradient-primary)'}}
                      style={{ width: `${(list.items.length / 10) * 100}%` }}
                    >
                      {/* Segmented progress indicator */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </div>
                    {/* Progress segments */}
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="absolute top-0 bottom-0 w-px" style={{ left: `${((i + 1) * 10)}%`, backgroundColor: 'rgba(139, 115, 85, 0.3)' }}></div>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center relative">
                  <div className="text-xs font-mono" style={{color: 'rgba(196, 181, 160, 0.4)'}}>
                    SYNC: {new Date(list.updated_at).toLocaleDateString().replace(/\//g, '.')}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list.id);
                    }}
                    className="px-3 py-1 rounded-none transition-all duration-200 border font-mono text-xs relative group"
                    style={{
                      backgroundColor: 'rgba(90, 44, 44, 0.8)',
                      color: 'var(--background)',
                      borderColor: 'rgba(90, 44, 44, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--background-secondary)';
                      e.currentTarget.style.borderColor = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(90, 44, 44, 0.8)';
                      e.currentTarget.style.color = 'var(--background)';
                      e.currentTarget.style.borderColor = 'rgba(90, 44, 44, 0.3)';
                    }}
                    title="Delete List"
                  >
                    <div className="flex items-center gap-1">
                      <Trash2 size={12} />
                      <span>DEL</span>
                    </div>
                  </button>
                </div>

                {/* Status line at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(139, 115, 85, 0.5), transparent)'}}></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
