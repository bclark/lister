'use client';

import { useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';
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
    <div className="flex flex-wrap gap-3">
      <button
        onClick={shareToSocial}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Share2 size={16} />
        Share
      </button>

      <button
        onClick={downloadAsImage}
        disabled={generatingImage}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        {generatingImage ? 'Generating...' : 'Download Image'}
      </button>

      <button
        onClick={copyToClipboard}
        className={`flex items-center gap-2 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          copied
            ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            : 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500'
        }`}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied!' : 'Copy Text'}
      </button>
    </div>
  );
}
