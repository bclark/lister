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
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category)}
            className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 hover:scale-105 transform ${
              selectedCategory?.id === category.id
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-glow-pink'
                : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-lg hover:shadow-purple-100'
            } animate-slide-in-up`}
            style={{animationDelay: `${index * 0.1}s`}}
          >
            {/* Background decoration */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative text-center">
              {category.icon && (
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
              )}
              <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-purple-700 transition-colors duration-300">
                {category.display_name}
              </h3>
              {category.description && (
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300 mb-4">
                  {category.description}
                </p>
              )}
              
              {/* Sub-genres preview */}
              {category.sub_genres && category.sub_genres.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-purple-600 font-medium mb-2">
                    Popular sub-genres:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {category.sub_genres.slice(0, 4).map((subGenre) => (
                      <span
                        key={subGenre.id}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200"
                      >
                        <span className="text-sm">{subGenre.icon}</span>
                        <span>{subGenre.display_name}</span>
                      </span>
                    ))}
                    {category.sub_genres.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200">
                        +{category.sub_genres.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {/* Fun hover effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-indigo-500/0 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-indigo-500/20 transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            </div>
            
            {/* Selection indicator */}
            {selectedCategory?.id === category.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-glow-pink">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
