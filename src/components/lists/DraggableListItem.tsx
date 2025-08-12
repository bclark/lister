'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ListItem } from '@/types';
import { Trash2, GripVertical } from 'lucide-react';

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
        isDragging ? 'shadow-lg' : ''
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Position Badge */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {position}
          </div>
        </div>

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={20} />
        </div>

        {/* Item Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">{item.title}</h4>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          )}
          {item.image_url && (
            <div className="mt-2">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-16 h-16 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
