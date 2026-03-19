import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { memo } from 'react';
import isEqual from 'react-fast-compare';
import { HiPencil, HiSwitchVertical, HiTrash } from 'react-icons/hi';
import { RiDraggable } from 'react-icons/ri';

import type { Task } from '~/lib/types/raw-db';

interface TaskItemProps {
  queueProps?: {
    isQueue: boolean;
    taskIndex: number;
    onClickSwap: (selectedIndex: number) => Promise<void>;
    onClickEdit: (selectedIndex: number) => void;
    onClickRemove: (selectedIndex: number) => void;
  };
  task: Task;
}

export const TaskItem = memo(({ task, queueProps }: TaskItemProps) => {
  const swapButtonContent = useBreakpointValue({
    base: null,
    md: 'Swap with Current',
  });

  const removeButtonContent = useBreakpointValue({
    base: null,
    md: 'Remove',
  });

  const handleClickSwap = async () => {
    await queueProps?.onClickSwap(queueProps.taskIndex);
  };

  const handleClickEdit = () => {
    queueProps?.onClickEdit(queueProps.taskIndex);
  };

  const handleClickRemove = () => {
    queueProps?.onClickRemove(queueProps.taskIndex);
  };

  return (
    <Flex
      _active={{ cursor: queueProps?.isQueue ? 'grab' : undefined }}
      _hover={{ cursor: queueProps?.isQueue ? 'move' : undefined }}
      alignItems="center"
      borderColor="gray.400"
      borderRadius={12}
      borderWidth={2}
      gap={4}
      marginBottom={2}
      padding={4}
    >
      {queueProps?.isQueue ? <RiDraggable /> : null}
      <Box>
        <Heading fontSize="xl">{task.name}</Heading>
        {task.description && <Text>{task.description}</Text>}

        {queueProps?.isQueue && (
          <Flex gridGap={2} marginTop={2}>
            <Button
              colorScheme="orange"
              leftIcon={<HiSwitchVertical />}
              onClick={handleClickSwap}
              size="sm"
            >
              {swapButtonContent}
            </Button>

            <Button
              colorScheme="teal"
              leftIcon={<HiPencil />}
              onClick={handleClickEdit}
              size="sm"
            >
              Edit
            </Button>

            <Button
              colorScheme="red"
              leftIcon={<HiTrash />}
              onClick={handleClickRemove}
              size="sm"
            >
              {removeButtonContent}
            </Button>
          </Flex>
        )}
      </Box>

      {task.estimation && task.estimation >= 0 && (
        <Text fontSize="lg" fontWeight="bold" marginLeft="auto">
          {task.estimation}
        </Text>
      )}
    </Flex>
  );
}, isEqual);

TaskItem.displayName = 'TaskItem';
