'use client';

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { memo, useCallback } from 'react';
import isEqual from 'react-fast-compare';

import type { Task } from '~/lib/types/raw-db';

import { SortableTaskItem } from './sortable-task-item';
import { CompletedTaskItem } from './task-item';
import type { SortableTaskItem as SortableTaskItemType } from './types';

interface SortableQueueProps {
  onClickEdit: (selectedIndex: number) => void;
  onClickRemove: (selectedIndex: number) => void;
  onClickSwap: (selectedIndex: number) => Promise<void>;
  onRewriteQueue: (updatedQueue: Array<SortableTaskItemType>) => Promise<void>;
  sortableQueue: Array<SortableTaskItemType>;
  task: Task;
}

export const SortableQueue = memo(
  ({
    sortableQueue,
    task,
    onRewriteQueue,
    onClickSwap,
    onClickEdit,
    onClickRemove,
  }: SortableQueueProps) => {
    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = useCallback(
      (event: {
        active: { id: string | number };
        over: { id: string | number } | null;
      }) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
          const oldIndex = sortableQueue.findIndex(
            (item) => item.id === active.id
          );
          const newIndex = sortableQueue.findIndex(
            (item) => item.id === over.id
          );
          const newQueue = arrayMove(sortableQueue, oldIndex, newIndex);
          onRewriteQueue(newQueue);
        }
      },
      [sortableQueue, onRewriteQueue]
    );

    const queueItemIds = sortableQueue.map((item) => item.id);

    return (
      <>
        <div>Current:</div>
        <CompletedTaskItem task={task} />

        <div>Queue:</div>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <SortableContext
            items={queueItemIds}
            strategy={verticalListSortingStrategy}
          >
            {sortableQueue?.map((queueItem, index) => (
              <SortableTaskItem
                key={queueItem.id}
                queueCallbacks={{
                  onClickEdit,
                  onClickRemove,
                  onClickSwap,
                  taskIndex: index,
                }}
                task={queueItem}
              />
            ))}
          </SortableContext>
        </DndContext>
      </>
    );
  },
  isEqual
);

SortableQueue.displayName = 'SortableQueue';
