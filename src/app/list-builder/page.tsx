'use client';

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { List, ListItem, Category, CreateListItemInput, SubGenre } from '@/types';
import { listStore } from '@/lib/listStore';
import CategorySelector from '@/components/categories/CategorySelector';
import DraggableList from '@/components/lists/DraggableList';
import AddItemForm from '@/components/lists/AddItemForm';
import ShareButtons from '@/components/sharing/ShareButtons';
import { ArrowLeft, Sparkles, Trophy, Star } from 'lucide-react';

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
      { id: '6-10', name: 'multiplayer', display_name: 'Multiplayer', icon: '👥' }
    ]
  },
];

function ListBuilderContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubGenre, setSelectedSubGenre] = useState<SubGenre | null>(null);
  const [list, setList] = useState<List | null>(null);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  // Add effect to load existing list if listId is provided
  useEffect(() => {
    const listId = searchParams.get('listId');
    if (listId && user) {
      // Get all lists for the user and find the specific one
      const allLists = listStore.getLists(user.id);
      const existingList = allLists.find(list => list.id === listId);
      
      if (existingList) {
        // Load the existing list
        setList(existingList);
        
        // Find and set the category
        const category = mockCategories.find(cat => cat.id === existingList.category_id);
        
        if (category) {
          setSelectedCategory(category);
          
          // Try to find the sub-genre if it exists
          if (existingList.sub_genre_id) {
            const subGenre = category.sub_genres?.find(sg => sg.id === existingList.sub_genre_id);
            if (subGenre) {
              setSelectedSubGenre(subGenre);
            }
          }
          
          // If no sub-genre, we need to set a default one or handle this case
          if (!existingList.sub_genre_id) {
            // Create a default sub-genre for the general category
            const defaultSubGenre: SubGenre = {
              id: `${category.id}-general`,
              name: category.name,
              display_name: `All ${category.display_name}s`,
              icon: category.icon || '🎯'
            };
            setSelectedSubGenre(defaultSubGenre);
          }
        }
      }
    }
  }, [user, searchParams]); // Include searchParams to satisfy dependency array

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSubGenre(null);
    setList(null);
  };

  const handleSubGenreSelect = (subGenre: SubGenre) => {
    setSelectedSubGenre(subGenre);
    
    // Create a new list or load existing one
    const listId = `list-${Date.now()}`;
    const newList: List = {
      id: listId,
      user_id: user?.id || '',
      category_id: selectedCategory?.id || '',
      sub_genre_id: subGenre.id,
      year,
      title: `My Top ${subGenre.display_name} ${selectedCategory?.display_name}s of ${year}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: [],
    };
    
    // Save the list to storage
    listStore.saveList(newList);
    setList(newList);
  };

  const handleAddItem = (itemData: Omit<CreateListItemInput, 'position'>) => {
    if (!list) return;

    const newItem: ListItem = {
      id: `temp-${Date.now()}`,
      ...itemData,
      position: list.items.length + 1,
      list_id: list.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const newItems = [...list.items, newItem];
    
    // If list is full, remove the last item
    if (newItems.length > 10) {
      newItems.pop();
    }

    // Update positions
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    const updatedList = {
      ...list,
      items: updatedItems,
      updated_at: new Date().toISOString(),
    };

    // Save to storage
    listStore.saveList(updatedList);
    setList(updatedList);
  };

  const handleReorder = (items: ListItem[]) => {
    if (!list) return;
    
    const updatedList = {
      ...list,
      items,
      updated_at: new Date().toISOString(),
    };
    
    // Save to storage
    listStore.saveList(updatedList);
    setList(updatedList);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!list) return;
    
    const newItems = list.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({
        ...item,
        position: index + 1,
      }));

    const updatedList = {
      ...list,
      items: newItems,
      updated_at: new Date().toISOString(),
    };
    
    // Save to storage
    listStore.saveList(updatedList);
    setList(updatedList);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubGenre(null);
    setList(null);
  };

  const handleBackToSubGenres = () => {
    setSelectedSubGenre(null);
    setList(null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen" style={{background: 'var(--gradient-secondary)'}}>
      {/* Header */}
      <header className="backdrop-blur-sm shadow-2xl border-b-2 relative overflow-hidden" style={{backgroundColor: 'rgba(61, 51, 39, 0.95)', borderBottomColor: 'rgba(139, 115, 85, 0.6)'}}>
        <div className="absolute inset-0" style={{background: 'var(--gradient-accent)', opacity: 0.1}}></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `linear-gradient(var(--border-light) 1px, transparent 1px), linear-gradient(90deg, var(--border-light) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-row justify-between items-center py-4 sm:h-20 gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {selectedCategory && (
                <button
                  onClick={selectedSubGenre ? handleBackToSubGenres : handleBackToCategories}
                  className="p-2 sm:p-3 rounded-none transition-all duration-200 flex-shrink-0 border hover:shadow-lg"
                  style={{
                    color: 'var(--border)',
                    borderColor: 'var(--border-light)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.backgroundColor = 'rgba(139, 115, 85, 0.2)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
                </button>
              )}
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  {/* Circular radar-like element */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 rounded-full relative" style={{borderColor: 'var(--border)'}}>
                    <div className="absolute inset-1 border rounded-full" style={{borderColor: 'var(--border-light)'}}></div>
                    <div className="absolute inset-2 rounded-full" style={{backgroundColor: 'var(--border-light)'}}></div>
                    <Star className="absolute inset-0 m-auto h-4 w-4 sm:h-5 sm:w-5" style={{color: 'var(--border)'}} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-xl font-bold truncate font-mono tracking-widest" style={{color: 'var(--background)'}}>
                    {selectedSubGenre 
                      ? `${selectedSubGenre.display_name.toUpperCase()}.${selectedCategory?.display_name.toUpperCase()}.BUILDER`
                      : selectedCategory 
                      ? `${selectedCategory.display_name.toUpperCase()}.BUILDER` 
                      : 'COLLECTION.BUILDER'
                    }
                  </h1>
                  <div className="text-xs font-mono" style={{color: 'rgba(196, 181, 160, 0.7)'}}>SYSTEM.ONLINE</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Status indicators */}
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono" style={{color: 'var(--border)'}}>STATUS: ACTIVE</div>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'var(--border)'}}></div>
              </div>
              
              <button
                onClick={() => router.push('/my-lists')}
                className="p-2 sm:p-3 rounded-none transition-all duration-200 border flex-shrink-0 hover:shadow-lg"
                style={{
                  color: 'var(--border)',
                  borderColor: 'var(--border-light)',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--primary)';
                  e.currentTarget.style.backgroundColor = 'rgba(139, 115, 85, 0.2)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--border)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                title="Archive Lists"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-8 sm:pt-16">
        {!selectedCategory ? (
          <div className="animate-slide-in-up">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-none mb-4 sm:mb-6 border" style={{background: 'var(--gradient-primary)', borderColor: 'var(--border)'}}>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" style={{color: 'var(--primary-dark)'}} />
                <span className="font-medium text-sm sm:text-base" style={{color: 'var(--primary-dark)'}}>✨ Choose Your Adventure ✨</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{color: 'var(--primary-dark)'}}>
                What&apos;s Your Passion?
              </h2>
              <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 sm:px-0" style={{color: 'var(--foreground)'}}>
                Pick a category and start building your amazing top 10 list! 🚀
              </p>
            </div>
            <CategorySelector
              categories={mockCategories}
              onSelectCategory={handleCategorySelect}
            />
          </div>
        ) : !selectedSubGenre ? (
          <div className="animate-slide-in-up">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-none mb-4 sm:mb-6 border" style={{background: 'var(--gradient-accent)', borderColor: 'var(--border)'}}>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" style={{color: 'var(--background-secondary)'}} />
                <span className="font-medium text-sm sm:text-base" style={{color: 'var(--background-secondary)'}}>🎯 Pick Your Sub-Genre 🎯</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{color: 'var(--primary-dark)'}}>
                {selectedCategory.display_name} Sub-Genres
              </h2>
              <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-4 sm:px-0" style={{color: 'var(--foreground)'}}>
                Choose a specific sub-genre or go with the general category! 🚀
              </p>
            </div>
            
            {/* Sub-Genre Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* General Category Option */}
              <button
                onClick={() => handleSubGenreSelect({
                  id: `${selectedCategory.id}-general`,
                  name: selectedCategory.name,
                  display_name: `All ${selectedCategory.display_name}s`,
                  icon: selectedCategory.icon || '🎯'
                })}
                className="group relative p-4 sm:p-6 rounded-none border-2 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                style={{
                  borderColor: 'rgba(139, 115, 85, 0.6)',
                  backgroundColor: 'rgba(61, 51, 39, 0.9)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(139, 115, 85, 0.6)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Corner brackets */}
                <div className="absolute top-1 left-1 w-3 h-3 border-l border-t" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                <div className="absolute top-1 right-1 w-3 h-3 border-r border-t" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                
                {/* Scanning line effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(139, 115, 85, 0.1), transparent)'}}></div>
                
                <div className="text-center relative">
                  <div className="relative mb-2 sm:mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-none flex items-center justify-center text-lg sm:text-xl font-bold border group-hover:transition-shadow duration-300" style={{background: 'var(--gradient-primary)', color: 'var(--primary-dark)', borderColor: 'var(--border)'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-glow)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                      {selectedCategory.icon || '🎯'}
                    </div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full border border-black"></div>
                  </div>
                  <h3 className="font-semibold text-xs sm:text-sm mb-1 transition-colors duration-300 font-mono tracking-wide" style={{color: 'var(--background)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--background-secondary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--background)'}>
                    ALL.{selectedCategory.display_name.toUpperCase()}S
                  </h3>
                  <p className="text-xs font-mono" style={{color: 'rgba(196, 181, 160, 0.6)'}}>
                    GENERAL.CAT
                  </p>
                </div>
              </button>
              
              {/* Sub-Genres */}
              {selectedCategory.sub_genres?.map((subGenre) => (
                <button
                  key={subGenre.id}
                  onClick={() => handleSubGenreSelect(subGenre)}
                  className="group relative p-4 sm:p-6 rounded-none border-2 backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                  style={{
                    borderColor: 'rgba(139, 115, 85, 0.4)',
                    backgroundColor: 'rgba(61, 51, 39, 0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-glow-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(139, 115, 85, 0.4)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Corner brackets */}
                  <div className="absolute top-1 left-1 w-3 h-3 border-l border-t" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                  <div className="absolute top-1 right-1 w-3 h-3 border-r border-t" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                  <div className="absolute bottom-1 left-1 w-3 h-3 border-l border-b" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                  <div className="absolute bottom-1 right-1 w-3 h-3 border-r border-b" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
                  
                  {/* Scanning line effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(139, 115, 85, 0.1), transparent)'}}></div>
                  
                  <div className="text-center relative">
                    <div className="relative mb-2 sm:mb-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-none flex items-center justify-center text-lg sm:text-xl font-bold border group-hover:transition-shadow duration-300" style={{background: 'var(--gradient-accent)', color: 'var(--background-secondary)', borderColor: 'var(--border)'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-glow)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                        {subGenre.icon}
                      </div>
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full border" style={{backgroundColor: 'var(--accent-blue)', borderColor: 'var(--primary-dark)'}}></div>
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm transition-colors duration-300 font-mono tracking-wide" style={{color: 'var(--background)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--background-secondary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--background)'}>
                      {subGenre.display_name.toUpperCase()}
                    </h3>
                  </div>
                  
                  {/* Status line at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(139, 115, 85, 0.3), transparent)'}}></div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12 animate-slide-in-up">
            {/* List Header */}
            <div className="text-center">
              <div className="backdrop-blur-sm rounded-none p-6 sm:p-8 border shadow-xl" style={{background: 'var(--gradient-secondary)', borderColor: 'var(--border-light)'}}>
                <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-none mb-4 sm:mb-6 border" style={{background: 'var(--gradient-primary)', borderColor: 'var(--border)'}}>
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5" style={{color: 'var(--primary-dark)'}} />
                  <span className="font-medium text-sm sm:text-base" style={{color: 'var(--primary-dark)'}}>🏆 Your Top 10 List 🏆</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4" style={{color: 'var(--primary-dark)'}}>
                  {list?.title || `My Top ${selectedSubGenre.display_name} ${selectedCategory.display_name}s of ${year}`}
                </h2>
                <p className="text-base sm:text-lg" style={{color: 'var(--foreground)'}}>
                  Drag and drop to reorder your items. Maximum of 10 items allowed.
                </p>
                {list && list.items.length > 0 && (
                  <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-none border" style={{backgroundColor: 'rgba(139, 115, 85, 0.2)', borderColor: 'var(--border-light)'}}>
                    <span className="font-medium text-sm sm:text-base" style={{color: 'var(--primary-dark)'}}>
                      {list.items.length}/10 items added
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Add Item Form */}
            <div className="backdrop-blur-sm rounded-none p-6 sm:p-8 shadow-xl border" style={{backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-light)'}}>
              <AddItemForm
                onAddItem={handleAddItem}
                disabled={list?.items.length === 10}
              />
            </div>

            {/* Draggable List */}
            {list && (
              <div className="bg-black/90 backdrop-blur-sm rounded-none p-6 sm:p-8 shadow-xl border-2 var(--border)/40 relative overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 var(--border)"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 var(--border)"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 var(--border)"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 var(--border)"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}></div>
                
                <div className="relative">
                  <DraggableList
                    items={list.items}
                    onReorder={handleReorder}
                    onRemoveItem={handleRemoveItem}
                    maxItems={10}
                  />
                </div>
              </div>
            )}

            {/* Share Buttons */}
            {list && list.items.length > 0 && (
              <div className="text-center bg-black/90 backdrop-blur-sm rounded-none p-6 sm:p-8 border-2 var(--border)/40 shadow-xl relative overflow-hidden">
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 var(--border)"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 var(--border)"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 var(--border)"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 var(--border)"></div>
                
                <div className="relative">
                  <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6">
                    <div className="w-4 h-4 border-2 rotate-45" style={{borderColor: 'var(--border)'}}></div>
                    <h3 className="text-xl sm:text-2xl font-bold font-mono tracking-wider" style={{color: 'var(--background)'}}>SHARE.PROTOCOL.ACTIVATED</h3>
                    <div className="w-4 h-4 border-2 rotate-45" style={{borderColor: 'var(--border)'}}></div>
                  </div>
                  <ShareButtons
                    list={list}
                    category={selectedCategory}
                    year={year}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function ListBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{background: 'var(--gradient-secondary)'}}>
      <div className="text-center">
        <div className="animate-spin rounded-none h-12 w-12 border-b-2 mx-auto mb-4" style={{borderBottomColor: 'var(--border)'}}></div>
        <p style={{color: 'var(--foreground)'}}>Loading...</p>
      </div>
    </div>}>
      <ListBuilderContent />
    </Suspense>
  );
}
