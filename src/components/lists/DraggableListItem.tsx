'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListItem } from '@/types';
import { GripVertical, X, Crown, Star } from 'lucide-react';

interface DraggableListItemProps {
  item: ListItem;
  position: number;
  onRemove: (id: string) => void;
}

export default function DraggableListItem({ 
  item, 
  position, 
  onRemove 
}: DraggableListItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Position styles using CSS variables and inline styles

  const getPositionIcon = (pos: number) => {
    if (pos === 1) return <Crown className="h-4 w-4 text-white" />;
    if (pos <= 3) return <Star className="h-4 w-4 text-white" />;
    return null;
  };

  const getPositionStyle = (pos: number) => {
    if (pos === 1) return { background: 'linear-gradient(to right, #fbbf24, #f97316)' }; // Gold
    if (pos === 2) return { background: 'linear-gradient(to right, #d1d5db, #9ca3af)' }; // Silver
    if (pos === 3) return { background: 'linear-gradient(to right, #d97706, #eab308)' }; // Bronze
    return { background: 'var(--gradient-primary)' }; // Default
  };

  return (
    <div
      ref={setNodeRef}
      className={`group backdrop-blur-sm border-2 rounded-none p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
        isDragging ? 'shadow-2xl rotate-2 scale-105' : ''
      }`}
      style={{backgroundColor: 'var(--background-secondary)', borderColor: 'var(--border-light)', ...style}}
    >
      <div className="flex items-center gap-5">
        {/* Position Badge */}
        <div className="flex-shrink-0 relative">
          <div 
            className="w-12 h-12 text-white rounded-none flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={getPositionStyle(position)}
          >
            {getPositionIcon(position) || position}
          </div>
          {position <= 3 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-none flex items-center justify-center animate-pulse" style={{background: 'var(--gradient-accent)'}}>
              <span className="text-white text-xs font-bold">#{position}</span>
            </div>
          )}
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab hover:cursor-grabbing p-2 rounded-none transition-all duration-200 hover:scale-110"
          style={{color: 'var(--border)'}}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.backgroundColor = 'var(--background)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--border)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <GripVertical size={20} />
        </div>

        {/* Item Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-xl mb-2 transition-colors duration-300" style={{color: 'var(--primary-dark)'}}>
            {item.title}
          </h4>
          {item.description && (
            <p className="leading-relaxed line-clamp-2 transition-colors duration-300" style={{color: 'var(--foreground)'}}>
              {item.description}
            </p>
          )}
        </div>

        {/* Item Image */}
        {item.image_url && (
          <div className="flex-shrink-0 w-20 h-20">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover rounded-none shadow-md group-hover:shadow-lg transition-shadow duration-300"
            />
          </div>
        )}

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item.id)}
          className="flex-shrink-0 p-2 rounded-none transition-all duration-200 hover:scale-110"
          style={{
            color: 'var(--accent)',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ff0000';
            e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--accent)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          title="Remove item"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}