'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Mail, Lock, ArrowRight, Star } from 'lucide-react';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
}

export default function SignInForm({ onSwitchToSignUp }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4 border border-purple-200">
          <Star className="h-4 w-4 text-purple-600" />
          <span className="text-purple-700 font-medium">Welcome Back!</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Sign In
        </h2>
        <p className="text-gray-600">Ready to create more amazing lists? 🚀</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-600 px-4 py-3 rounded-xl text-center font-medium animate-bounce-in">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-purple-600" />
              Email Address
            </div>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm placeholder-gray-400"
            placeholder="✨ Enter your email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-purple-600" />
              Password
            </div>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm placeholder-gray-400"
            placeholder="🔒 Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
        >
          <div className="flex items-center justify-center gap-2">
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </>
            )}
          </div>
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="group text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors duration-200 hover:scale-105 inline-flex items-center gap-1"
        >
          <span>Don't have an account?</span>
          <span className="font-semibold group-hover:underline">Sign up</span>
          <Sparkles className="h-3 w-3 text-pink-500 group-hover:animate-pulse" />
        </button>
      </div>
    </div>
  );
}
