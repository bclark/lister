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
            className={`group relative p-6 sm:p-8 rounded-none border-2 transition-all duration-300 transform backdrop-blur-sm hover:shadow-xl animate-slide-in-up overflow-hidden`}
            style={{
              backgroundColor: 'rgba(61, 51, 39, 0.9)',
              borderColor: selectedCategory?.id === category.id ? 'var(--border)' : 'rgba(139, 115, 85, 0.4)',
              boxShadow: selectedCategory?.id === category.id ? 'var(--shadow-glow)' : 'none',
              animationDelay: `${index * 0.1}s`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = selectedCategory?.id === category.id ? 'var(--border)' : 'rgba(139, 115, 85, 0.4)';
              e.currentTarget.style.boxShadow = selectedCategory?.id === category.id ? 'var(--shadow-glow)' : 'none';
            }}
          >
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2" style={{borderColor: 'rgba(139, 115, 85, 0.6)'}}></div>
            
            {/* Scanning line effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-pulse" style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(139, 115, 85, 0.1), transparent)'}}></div>
            
            <div className="relative text-center">
              {/* Icon with HUD styling */}
              {category.icon && (
                <div className="relative mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-none flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg border group-hover:transition-shadow duration-300" style={{background: 'var(--gradient-primary)', color: 'var(--primary-dark)', borderColor: 'var(--border)'}} onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-glow)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                    {category.icon}
                  </div>
                  {/* Status indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-none border" style={{backgroundColor: 'var(--accent)', borderColor: 'var(--primary-dark)'}}></div>
                </div>
              )}
              
              <h3 className="font-bold text-lg sm:text-xl mb-3 transition-colors duration-300 font-mono tracking-wider" style={{color: 'var(--background)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--background-secondary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--background)'}>
                {category.display_name.toUpperCase()}
              </h3>
              
              {category.description && (
                <p className="leading-relaxed group-hover:transition-colors duration-300 mb-4 text-sm font-mono" style={{color: 'rgba(196, 181, 160, 0.7)'}} onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(196, 181, 160, 0.8)'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(196, 181, 160, 0.7)'}>
                  {category.description}
                </p>
              )}
              
              {/* Technical readout section */}
              {category.sub_genres && category.sub_genres.length > 0 && (
                <div className="mt-4 border p-3" style={{borderColor: 'rgba(139, 115, 85, 0.2)', backgroundColor: 'rgba(139, 115, 85, 0.1)'}}>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-1 h-1 rounded-none" style={{backgroundColor: 'var(--border)'}}></div>
                    <p className="text-xs font-mono tracking-wide" style={{color: 'var(--border)'}}>
                      SUB.CATEGORIES.AVAILABLE
                    </p>
                    <div className="w-1 h-1 rounded-none" style={{backgroundColor: 'var(--border)'}}></div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                    {category.sub_genres.slice(0, 4).map((subGenre) => (
                      <span
                        key={subGenre.id}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-none border font-mono"
                        style={{backgroundColor: 'rgba(139, 115, 85, 0.2)', color: 'var(--background)', borderColor: 'rgba(139, 115, 85, 0.4)'}}
                      >
                        <span className="text-xs">{subGenre.icon}</span>
                        <span>{subGenre.display_name}</span>
                      </span>
                    ))}
                    {category.sub_genres.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs rounded-none border font-mono" style={{backgroundColor: 'rgba(139, 115, 85, 0.3)', color: 'var(--background-secondary)', borderColor: 'rgba(139, 115, 85, 0.5)'}}>
                        +{category.sub_genres.length - 4}.MORE
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Selection indicator */}
            {selectedCategory?.id === category.id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-none flex items-center justify-center border shadow-lg" style={{background: 'var(--gradient-primary)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-glow)'}}>
                  <svg className="w-4 h-4 text-black font-bold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                {/* Pulsing indicator */}
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-none animate-pulse" style={{backgroundColor: 'var(--accent)'}}></div>
              </div>
            )}
            
            {/* Status line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent" style={{backgroundImage: 'linear-gradient(to right, transparent, rgba(139, 115, 85, 0.5), transparent)'}}></div>
          </button>
        ))}
      </div>
    </div>
  );
}
