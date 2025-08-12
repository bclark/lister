'use client';

import { Category } from '@/types';

interface CategorySelectorProps {
  categories: Category[];
  onSelectCategory: (category: Category) => void;
  selectedCategory?: Category;
}

export default function CategorySelector({ 
  categories, 
  onSelectCategory, 
  selectedCategory 
}: CategorySelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Choose Your List Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              selectedCategory?.id === category.id
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div className="text-center">
              {category.icon && (
                <div className="text-3xl mb-3">{category.icon}</div>
              )}
              <h3 className="font-semibold text-lg mb-2">{category.display_name}</h3>
              {category.description && (
                <p className="text-sm text-gray-600">{category.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
