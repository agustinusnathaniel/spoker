'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { memo } from 'react';
import isEqual from 'react-fast-compare';

import { QueueTaskItem } from './task-item';
import type { SortableTaskItemProps } from './types';

export const SortableTaskItem = memo(
  ({ task, queueCallbacks }: SortableTaskItemProps) => {
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

    const handleClickSwap = async () => {
      await queueCallbacks.onClickSwap(queueCallbacks.taskIndex);
    };

    const handleClickEdit = () => {
      queueCallbacks.onClickEdit(queueCallbacks.taskIndex);
    };

    const handleClickRemove = () => {
      queueCallbacks.onClickRemove(queueCallbacks.taskIndex);
    };

    return (
      <div ref={setNodeRef} style={style}>
        <QueueTaskItem
          dragHandleProps={{ ...attributes, ...listeners }}
          onClickEdit={handleClickEdit}
          onClickRemove={handleClickRemove}
          onClickSwap={handleClickSwap}
          task={task}
        />
      </div>
    );
  },
  isEqual
);

SortableTaskItem.displayName = 'SortableTaskItem';
