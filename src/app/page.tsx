'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { Star, List, Share2, Users, Sparkles, Heart, Trophy, Zap } from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push('/list-builder');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-border"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white animate-spin"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-28 h-28 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-gradient-to-r from-green-200 to-teal-200 rounded-full opacity-20 animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Star className="h-10 w-10 text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text animate-pulse" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" style={{animationDelay: '0.5s'}} />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Lister
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20 animate-slide-in-up">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-6 py-3 rounded-full mb-8 border border-pink-200">
            <Sparkles className="h-5 w-5 text-pink-600" />
            <span className="text-pink-700 font-medium">✨ Create Amazing Lists ✨</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Curate Your Annual
            </span>
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Top 10 Lists
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Create, organize, and share your favorite movies, songs, books, and more with our 
            <span className="font-semibold text-purple-600"> magical drag-and-drop interface</span>. 
            Turn your passions into beautiful, shareable lists! 🚀
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="group text-center transform hover:scale-105 transition-all duration-300 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow-pink transition-all duration-300">
              <List className="h-10 w-10 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Curate Lists</h3>
            <p className="text-gray-600 leading-relaxed">
              Build your top 10 lists with our <span className="font-semibold text-pink-600">magical drag-and-drop</span> reordering
            </p>
          </div>
          
          <div className="group text-center transform hover:scale-105 transition-all duration-300 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
              <Share2 className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Share Everywhere</h3>
            <p className="text-gray-600 leading-relaxed">
              Export as <span className="font-semibold text-blue-600">stunning images</span> for social media or copy text for messaging
            </p>
          </div>
          
          <div className="group text-center transform hover:scale-105 transition-all duration-300 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
            <div className="bg-gradient-to-br from-green-100 to-teal-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow transition-all duration-300">
              <Users className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Multiple Categories</h3>
            <p className="text-gray-600 leading-relaxed">
              Movies, songs, books, games, TV shows, and <span className="font-semibold text-green-600">so much more</span>
            </p>
          </div>

          <div className="group text-center transform hover:scale-105 transition-all duration-300 animate-slide-in-up" style={{animationDelay: '0.4s'}}>
            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-glow-yellow transition-all duration-300">
              <Trophy className="h-10 w-10 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">Track Progress</h3>
            <p className="text-gray-600 leading-relaxed">
              See your <span className="font-semibold text-yellow-600">yearly progress</span> and discover new favorites
            </p>
          </div>
        </div>

        {/* Fun stats or social proof */}
        <div className="bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm rounded-3xl p-8 mb-16 border border-white/50 shadow-xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">🎯</div>
              <div className="text-2xl font-bold text-gray-800">10</div>
              <div className="text-gray-600">Perfect Items</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">🚀</div>
              <div className="text-2xl font-bold text-gray-800">∞</div>
              <div className="text-gray-600">Possibilities</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-600 mb-2">💫</div>
              <div className="text-2xl font-bold text-gray-800">100%</div>
              <div className="text-gray-600">Fun Factor</div>
            </div>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="max-w-md mx-auto animate-slide-in-up" style={{animationDelay: '0.5s'}}>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
            {showSignUp ? (
              <SignUpForm onSwitchToSignIn={() => setShowSignUp(false)} />
            ) : (
              <SignInForm onSwitchToSignUp={() => setShowSignUp(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-100/50 to-transparent"></div>
    </div>
  );
}
