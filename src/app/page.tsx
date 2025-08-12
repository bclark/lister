'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Star, List, Share2, Users } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    router.push('/list-builder');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Lister</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Curate Your Annual
            <span className="text-blue-600"> Top 10 Lists</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create, organize, and share your favorite movies, songs, books, and more. 
            Drag and drop to prioritize, then share your curated lists with the world.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <List className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Curate Lists</h3>
            <p className="text-gray-600">
              Build your top 10 lists with drag-and-drop reordering
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Everywhere</h3>
            <p className="text-gray-600">
              Export as images for social media or copy text for messaging
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Categories</h3>
            <p className="text-gray-600">
              Movies, songs, books, games, TV shows, and more
            </p>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md mx-auto">
          {showSignUp ? (
            <SignUpForm onSwitchToSignIn={() => setShowSignUp(false)} />
          ) : (
            <SignInForm onSwitchToSignUp={() => setShowSignUp(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
