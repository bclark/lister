'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListItem } from '@/types';
import { Trash2, GripVertical, Star, Crown } from 'lucide-react';

interface DraggableListItemProps {
  item: ListItem;
  position: number;
  onRemove: () => void;
}

export default function DraggableListItem({ item, position, onRemove }: DraggableListItemProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  // Different colors for top 3 positions
  const getPositionColors = (pos: number) => {
    if (pos === 1) return 'from-yellow-400 to-orange-500'; // Gold
    if (pos === 2) return 'from-gray-300 to-gray-400'; // Silver
    if (pos === 3) return 'from-amber-600 to-yellow-600'; // Bronze
    return 'from-purple-400 to-pink-500'; // Default
  };

  const getPositionIcon = (pos: number) => {
    if (pos === 1) return <Crown className="h-4 w-4 text-white" />;
    if (pos <= 3) return <Star className="h-4 w-4 text-white" />;
    return null;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
        isDragging ? 'shadow-2xl rotate-2 scale-105' : ''
      }`}
    >
      <div className="flex items-center gap-5">
        {/* Position Badge */}
        <div className="flex-shrink-0 relative">
          <div className={`w-12 h-12 bg-gradient-to-r ${getPositionColors(position)} text-white rounded-2xl flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {getPositionIcon(position) || position}
          </div>
          {position <= 3 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs font-bold">#{position}</span>
            </div>
          )}
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab hover:cursor-grabbing text-purple-400 hover:text-purple-600 p-2 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-110"
        >
          <GripVertical size={20} />
        </div>

        {/* Item Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-xl text-gray-800 group-hover:text-purple-700 transition-colors duration-300 mb-2">
            {item.title}
          </h4>
          {item.description && (
            <p className="text-gray-600 leading-relaxed line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
              {item.description}
            </p>
          )}
          {item.image_url && (
            <div className="mt-3">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-20 h-20 object-cover rounded-xl border-2 border-purple-200 group-hover:border-purple-300 transition-colors duration-300 shadow-md"
              />
            </div>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110 border-2 border-transparent hover:border-red-200"
          title="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-indigo-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-indigo-500/5 transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
    </div>
  );
}
