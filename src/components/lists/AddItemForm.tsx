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
        className="group w-full p-6 border-2 border-dashed rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
        style={{
          borderColor: 'var(--border-light)',
          color: 'var(--border)',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.color = 'var(--primary)';
          e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.color = 'var(--border)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <Plus size={24} className="group-hover:scale-110 transition-transform duration-300" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{color: 'var(--accent)'}} />
          </div>
          <span className="text-lg font-medium">Add New Item</span>
        </div>
      </button>
    );
  }

  return (
    <div className="relative animate-bounce-in">
      <form onSubmit={handleSubmit} className="border-2 rounded-none p-6 shadow-lg" style={{background: 'var(--background-secondary)', borderColor: 'var(--border-light)'}}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-none flex items-center justify-center" style={{background: 'var(--gradient-primary)'}}>
              <Plus size={16} className="text-white" />
            </div>
            <h3 className="text-lg font-bold" style={{color: 'var(--primary-dark)'}}>Add New Item</h3>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-none transition-all duration-200 hover:scale-110"
            style={{
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--primary-dark)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--foreground)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold mb-2" style={{color: 'var(--foreground)'}}>
              Title <span style={{color: 'var(--accent)'}}>*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-3 border-2 rounded-none focus:outline-none transition-all duration-200 backdrop-blur-sm"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 115, 85, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="✨ Enter item title"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold mb-2" style={{color: 'var(--foreground)'}}>
              Description <span style={{color: 'var(--foreground)', opacity: 0.7}}>(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 rounded-none focus:outline-none transition-all duration-200 backdrop-blur-sm resize-none"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 115, 85, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="💭 Tell us more about this item..."
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-semibold mb-2" style={{color: 'var(--foreground)'}}>
              Image URL <span style={{color: 'var(--foreground)', opacity: 0.7}}>(optional)</span>
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-none focus:outline-none transition-all duration-200 backdrop-blur-sm"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(139, 115, 85, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-light)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              placeholder="🖼️ https://example.com/image.jpg"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 text-white py-3 px-6 rounded-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 font-semibold shadow-lg hover:shadow-xl"
              style={{background: 'var(--gradient-primary)'}}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--gradient-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--gradient-primary)';
              }}
            >
              ✨ Add Item
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 rounded-none focus:outline-none transition-all duration-200 hover:scale-105 font-medium backdrop-blur-sm"
              style={{
                borderColor: 'var(--border-light)',
                color: 'var(--foreground)',
                backgroundColor: 'rgba(255, 255, 255, 0.8)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.borderColor = 'var(--border-light)';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}