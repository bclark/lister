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
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          Your Top {maxItems} Items ({items.length}/{maxItems})
        </h3>
        {items.length === maxItems && (
          <span className="text-sm text-gray-500">
            List is full. Adding a new item will remove the last one.
          </span>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
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
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Your list is empty</p>
          <p className="text-sm">Add your first item to get started!</p>
        </div>
      )}
    </div>
  );
}
