'use client';

import { useState } from 'react';
import { CreateListItemInput } from '@/types';
import { Plus, Sparkles, X } from 'lucide-react';

interface AddItemFormProps {
  onAddItem: (item: Omit<CreateListItemInput, 'position'>) => void;
  disabled?: boolean;
}

export default function AddItemForm({ onAddItem, disabled }: AddItemFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddItem({
      title: title.trim(),
      description: description.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setImageUrl('');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        disabled={disabled}
        className="group w-full p-6 border-2 border-dashed border-purple-300 rounded-2xl text-purple-600 hover:border-purple-400 hover:text-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-lg"
      >
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Plus size={24} className="group-hover:scale-110 transition-transform duration-300" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <span className="text-lg font-medium">Add New Item</span>
        </div>
      </button>
    );
  }

  return (
    <div className="relative animate-bounce-in">
      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Plus size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Add New Item</h3>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-full transition-all duration-200 hover:scale-110"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm"
              placeholder="✨ Enter item title"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm resize-none"
              placeholder="💭 Tell us more about this item..."
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-2">
              Image URL <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300 bg-white/80 backdrop-blur-sm"
              placeholder="🖼️ https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
            >
              ✨ Add Item
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-purple-200 text-purple-700 rounded-xl hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105 font-medium bg-white/80 backdrop-blur-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
