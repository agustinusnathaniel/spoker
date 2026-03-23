'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { memo } from 'react';
import { HiPencil, HiSwitchVertical, HiTrash } from 'react-icons/hi';
import { RiDraggable } from 'react-icons/ri';

import type { Task } from '~/lib/types/raw-db';

// ============================================================================
// Base Task Display Component
// ============================================================================

interface TaskDisplayProps {
  task: Task;
}

function TaskDisplay({ task }: TaskDisplayProps) {
  return (
    <Box flex={1}>
      <Heading fontSize="xl" textWrap="balance" wordBreak="break-word">
        {task.name}
      </Heading>
      {task.description && <Text>{task.description}</Text>}
    </Box>
  );
}

function TaskEstimation({ estimation }: { estimation: number }) {
  return (
    <Text fontSize="lg" fontWeight="bold" marginLeft="auto">
      {estimation}
    </Text>
  );
}

// ============================================================================
// Completed Task Item - Simple display only
// ============================================================================

export interface CompletedTaskItemProps {
  task: Task;
}

export const CompletedTaskItem = memo(function CompletedTaskItem({
  task,
}: CompletedTaskItemProps) {
  return (
    <Flex
      alignItems="center"
      borderColor="gray.400"
      borderRadius={12}
      borderWidth={2}
      gap={4}
      marginBottom={2}
      padding={4}
    >
      <TaskDisplay task={task} />
      {task.estimation !== undefined && task.estimation >= 0 && (
        <TaskEstimation estimation={task.estimation} />
      )}
    </Flex>
  );
});

// ============================================================================
// Queue Task Item - With drag handle and actions
// ============================================================================

interface QueueTaskActionsProps {
  onClickEdit: () => void;
  onClickRemove: () => void;
  onClickSwap: () => Promise<void>;
}

function QueueTaskActions({
  onClickEdit,
  onClickRemove,
  onClickSwap,
}: QueueTaskActionsProps) {
  const swapButtonContent = useBreakpointValue({
    base: null,
    md: 'Swap with Current',
  });

  const removeButtonContent = useBreakpointValue({
    base: null,
    md: 'Remove',
  });

  return (
    <Flex gap={2} marginTop={2}>
      <Button colorPalette="orange" onClick={onClickSwap} size="sm">
        <HiSwitchVertical />
        {swapButtonContent}
      </Button>

      <Button colorPalette="teal" onClick={onClickEdit} size="sm">
        <HiPencil />
        Edit
      </Button>

      <Button colorPalette="red" onClick={onClickRemove} size="sm">
        <HiTrash />
        {removeButtonContent}
      </Button>
    </Flex>
  );
}

export interface QueueTaskItemProps {
  dragHandleProps?: Record<string, unknown>;
  onClickEdit: () => void;
  onClickRemove: () => void;
  onClickSwap: () => Promise<void>;
  task: Task;
}

export const QueueTaskItem = memo(function QueueTaskItem({
  task,
  dragHandleProps,
  onClickSwap,
  onClickEdit,
  onClickRemove,
}: QueueTaskItemProps) {
  return (
    <Flex
      alignItems="center"
      borderColor="gray.400"
      borderRadius={12}
      borderWidth={2}
      gap={4}
      marginBottom={2}
      padding={4}
    >
      <Box
        _active={{ cursor: 'grabbing' }}
        cursor="grab"
        padding={2}
        {...dragHandleProps}
      >
        <RiDraggable />
      </Box>
      <Box flex={1}>
        <Heading fontSize="xl" textWrap="balance" wordBreak="break-word">
          {task.name}
        </Heading>
        {task.description && <Text>{task.description}</Text>}
        <QueueTaskActions
          onClickEdit={onClickEdit}
          onClickRemove={onClickRemove}
          onClickSwap={onClickSwap}
        />
      </Box>
    </Flex>
  );
});
