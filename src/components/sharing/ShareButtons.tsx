'use client';

import { useState } from 'react';
import { Share2, Download, Copy, Check, Sparkles, Heart, Star } from 'lucide-react';
import { List, Category } from '@/types';

interface ShareButtonsProps {
  list: List;
  category: Category;
  year: number;
}

export default function ShareButtons({ list, category, year }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

  const generateShareText = () => {
    const items = list.items.map((item, index) => `${index + 1}. ${item.title}`).join('\n');
    return `My Top ${list.items.length} ${category.display_name}s of ${year}:\n\n${items}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsImage = async () => {
    setGeneratingImage(true);
    try {
      // This would integrate with html2canvas to generate an image
      // For now, we'll just show a placeholder
      alert('Image generation feature coming soon!');
    } catch (err) {
      console.error('Failed to generate image: ', err);
    } finally {
      setGeneratingImage(false);
    }
  };

  const shareToSocial = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Top ${category.display_name}s of ${year}`,
          text: generateShareText(),
        });
      } catch (err) {
        console.error('Failed to share: ', err);
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard();
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <button
        onClick={shareToSocial}
        className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
      >
        <Share2 size={20} className="group-hover:rotate-12 transition-transform duration-300" />
        <span>Share Everywhere</span>
        <Sparkles className="h-4 w-4 text-blue-200 group-hover:animate-pulse" />
      </button>

      <button
        onClick={downloadAsImage}
        disabled={generatingImage}
        className="group flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
      >
        <Download size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
        <span>{generatingImage ? 'Generating...' : 'Download Image'}</span>
        {!generatingImage && <Star className="h-4 w-4 text-green-200 group-hover:animate-pulse" />}
      </button>

      <button
        onClick={copyToClipboard}
        className={`group flex items-center gap-3 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold ${
          copied
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500'
            : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 focus:ring-purple-500'
        }`}
      >
        {copied ? (
          <>
            <Check size={20} className="group-hover:scale-110 transition-transform duration-300" />
            <span>Copied!</span>
            <Heart className="h-4 w-4 text-green-200 group-hover:animate-pulse" />
          </>
        ) : (
          <>
            <Copy size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Copy Text</span>
            <Sparkles className="h-4 w-4 text-purple-200 group-hover:animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}
