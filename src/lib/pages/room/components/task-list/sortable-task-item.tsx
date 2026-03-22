'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import isEqual from 'react-fast-compare';

import { TaskItem } from './task-item';
import type { SortableTaskItemProps } from './types';

export const SortableTaskItem = memo(
  ({ task, queueProps }: SortableTaskItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: task.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div ref={setNodeRef} style={style}>
        <TaskItem
          dragHandleProps={{ ...attributes, ...listeners }}
          queueProps={queueProps}
          task={task}
        />
      </div>
    );
  },
  isEqual
);

SortableTaskItem.displayName = 'SortableTaskItem';
