'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { ListItem } from '@/types';
import DraggableListItem from './DraggableListItem';
import { Trophy, Sparkles, GripVertical } from 'lucide-react';

interface DraggableListProps {
  items: ListItem[];
  onReorder: (items: ListItem[]) => void;
  onRemoveItem: (itemId: string) => void;
  maxItems?: number;
}

export default function DraggableList({ 
  items, 
  onReorder, 
  onRemoveItem, 
  maxItems = 10 
}: DraggableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over?.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      // Update positions after reordering
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        position: index + 1,
      }));
      
      onReorder(updatedItems);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full mb-4 border border-yellow-200">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span className="text-yellow-700 font-semibold">
            Your Top {maxItems} Items ({items.length}/{maxItems})
          </span>
        </div>
        
        {items.length === maxItems && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-teal-100 px-4 py-2 rounded-full border border-green-200">
            <Sparkles className="h-4 w-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">
              List is full! Adding a new item will remove the last one.
            </span>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {items.map((item, index) => (
              <DraggableListItem
                key={item.id}
                item={item}
                position={index + 1}
                onRemove={() => onRemoveItem(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GripVertical className="h-12 w-12 text-purple-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Your list is empty</h3>
          <p className="text-gray-500 text-lg">Add your first item to get started! ✨</p>
        </div>
      )}
    </div>
  );
}
