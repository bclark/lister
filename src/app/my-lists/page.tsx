'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { List, Category } from '@/types';
import { listStore } from '@/lib/listStore';
import { Star, Sparkles, Plus, Edit3, Trash2, Eye, Calendar, Trophy, ArrowLeft } from 'lucide-react';

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
  const { user, signOut } = useAuth();
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

  const handleCreateNewList = () => {
    router.push('/list-builder');
  };

  const handleViewList = (list: List) => {
    // Navigate to list builder with this list pre-loaded
    router.push(`/list-builder?listId=${list.id}`);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/list-builder')}
                className="p-3 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Star className="h-8 w-8 text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text" />
                  <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  My Lists
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 bg-white/80 px-4 py-2 rounded-full border border-gray-200">
                {user.email}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105 border border-purple-200"
              >
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-6 py-3 rounded-full mb-6 border border-purple-200">
            <Trophy className="h-5 w-5 text-purple-600" />
            <span className="text-purple-700 font-medium">🏆 Your Collection of Lists 🏆</span>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            My Top 10 Lists
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            View, edit, and manage all your amazing curated lists! 🚀
          </p>
        </div>

        {/* Year Filter and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <label className="text-lg font-semibold text-gray-700">Filter by Year:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <button
              onClick={refreshLists}
              className="px-4 py-2 border-2 border-purple-200 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105"
              title="Refresh lists"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          
          <button
            onClick={handleCreateNewList}
            className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create New List</span>
          </button>
        </div>

        {/* Lists Grid */}
        {filteredLists.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No lists found for {selectedYear}</h3>
            <p className="text-gray-500 text-lg mb-6">Start creating your first list to get started! ✨</p>
            <button
              onClick={handleCreateNewList}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>Create Your First List</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLists.map((list, index) => (
              <div
                key={list.id}
                className="group bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* List Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                      {getCategoryIcon(list.category_id)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                        {list.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getCategoryName(list.category_id)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* List Stats */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {list.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy size={14} />
                      {list.items.length}/10 items
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(list.items.length / 10) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewList(list)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 hover:scale-105 font-medium"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleEditList(list)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-200 hover:scale-105 font-medium"
                  >
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteList(list.id)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 hover:scale-105"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Last Updated */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                  Last updated: {new Date(list.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
