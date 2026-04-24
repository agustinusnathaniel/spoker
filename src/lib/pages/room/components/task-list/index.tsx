'use client';

import {
  Box,
  Button,
  Flex,
  Grid,
  Tabs,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import isEqual from 'react-fast-compare';
import { useForm } from 'react-hook-form';
import { GoPlus } from 'react-icons/go';
import { useShallow } from 'zustand/shallow';

import { AutoResizeTextarea } from '~/lib/components/auto-resize-textarea';
import { Modal } from '~/lib/components/spoker-modal-wrapper';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { useColorModeValue } from '~/lib/components/ui/color-mode';
import { toaster } from '~/lib/components/ui/toaster';
import { emptyRoom } from '~/lib/constants/empty-room';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { submitStoryFormValidationSchema } from '~/lib/models/task-list';
import { editQueueItem } from '~/lib/services/firebase/room/update/queue/edit';
import { removeQueueItem } from '~/lib/services/firebase/room/update/queue/remove';
import { swapSelectedQueueWithCurrent } from '~/lib/services/firebase/room/update/queue/swap';
import { rewriteQueue } from '~/lib/services/firebase/room/update/rewrite-queue';
import { useRoomStore } from '~/lib/stores/room';
import type { Task } from '~/lib/types/raw-db';

import { CompletedTaskItem } from './task-item';
import type {
  SortableTaskItem as SortableTaskItemType,
  UpsertStoryForm,
} from './types';

// Dynamically import DnD components to reduce initial bundle size
// Only owners need drag-and-drop functionality
const SortableQueue = dynamic(
  () => import('./sortable-queue').then((mod) => mod.SortableQueue),
  { ssr: false }
);

const initialFormValue: UpsertStoryForm = {
  name: '',
  description: '',
};

export const TaskList = () => {
  const params = useParams();
  const id = params?.id as string;

  const queue = useRoomStore(
    useShallow((state) => state.roomData?.queue ?? emptyRoom.queue)
  );
  const completed = useRoomStore(
    useShallow((state) => state.roomData?.completed ?? emptyRoom.completed)
  );
  const task = useRoomStore(
    useShallow((state) => state.roomData?.task ?? emptyRoom.task)
  );
  const showVote = useRoomStore(useShallow((state) => state.showVote));

  const queueRef = useRef(queue);
  const taskRef = useRef(task);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    taskRef.current = task;
  }, [task]);

  const { isOwner } = useUserRole();
  const tabTextColor = useColorModeValue('', 'gray.300');
  const [isOpenAddStory, setIsOpenAddStory] = useState<boolean>(false);
  const [isOpenEditStory, setIsOpenEditStory] = useState<boolean>(false);
  const [isOpenRemoveStory, setIsOpenRemoveStory] = useState<boolean>(false);
  const buttonContent = useBreakpointValue<ReactNode>({
    base: <GoPlus />,
    md: 'Add Story',
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState<string>(
    isOwner ? 'active' : 'completed'
  );
  const [isBusy, setIsBusy] = useState<boolean>();
  const [selectedEditStoryIndex, setSelectedEditStoryIndex] =
    useState<number>();

  const sortableQueue: Array<SortableTaskItemType> = useMemo(
    () => (queue ?? []) as Array<SortableTaskItemType>,
    [queue]
  );

  const all = useMemo(
    () => [task, ...(queue ?? []), ...(completed ?? [])],
    [completed, queue, task]
  );

  const tabTexts = useMemo(() => {
    const activeStoriesLengthText = queue?.length
      ? ` (${queue.length + 1})`
      : ' (1)';
    const queueLengthText = queue?.length ? ` (${queue.length})` : '';
    const completedLengthText = completed?.length
      ? ` (${completed.length})`
      : '';

    return {
      activeStoriesTabText: `Active${activeStoriesLengthText}`,
      queueTabText: `Queue${queueLengthText}`,
      completedTabText: `Completed${completedLengthText}`,
      allTabText: `All (${all.length})`,
    };
  }, [queue?.length, completed?.length, all.length]);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: initialFormValue,
    resolver: zodResolver(submitStoryFormValidationSchema),
    mode: 'onChange',
  });

  const {
    register: registerEditStoryField,
    handleSubmit: handleSubmitEditStory,
    reset: resetEditStoryForm,
    getValues: getEditStoryValues,
    formState: {
      errors: editStoryErrors,
      isValid: isEditStoryValid,
      isDirty: isEditStoryDirty,
    },
  } = useForm({
    resolver: zodResolver(submitStoryFormValidationSchema),
    mode: 'onChange',
  });

  const onOpenAddStory = useCallback(() => setIsOpenAddStory(true), []);
  const onCloseAddStory = useCallback(() => setIsOpenAddStory(false), []);
  const onOpenEditStory = useCallback(() => setIsOpenEditStory(true), []);
  const onCloseEditStory = useCallback(() => setIsOpenEditStory(false), []);
  const onOpenRemoveStory = useCallback(() => setIsOpenRemoveStory(true), []);
  const onCloseRemoveStory = useCallback(() => setIsOpenRemoveStory(false), []);

  const handleAddStory = useCallback(async () => {
    if (isValid && isOwner) {
      const values = getValues();
      const randomId = nanoid(21);
      setIsBusy(true);
      await rewriteQueue(id, [
        ...(queueRef.current ?? []),
        { ...values, id: randomId } as Task,
      ]);
      onCloseAddStory();
      setIsBusy(false);
      setSelectedTabIndex('active');
      reset();
    }
  }, [id, isOwner, isValid, onCloseAddStory, reset, getValues]);

  const handleOpenEditStory = useCallback(
    (selectedIndex: number) => {
      setSelectedEditStoryIndex(selectedIndex);
      const selectedQueueItem = queueRef.current?.[selectedIndex];
      resetEditStoryForm({
        name: selectedQueueItem?.name,
        description: selectedQueueItem?.description,
      });
      onOpenEditStory();
    },
    [onOpenEditStory, resetEditStoryForm]
  );

  const closeEditStory = useCallback(() => {
    setSelectedEditStoryIndex(undefined);
    onCloseEditStory();
    resetEditStoryForm();
  }, [onCloseEditStory, resetEditStoryForm]);

  const processEditStory = useCallback(async () => {
    if (isOwner && selectedEditStoryIndex !== undefined && isEditStoryValid) {
      const values = getEditStoryValues();
      setIsBusy(true);
      await editQueueItem({
        roomId: id,
        updatedItem: values as Task,
        selectedQueueIndex: selectedEditStoryIndex,
        queue: queueRef.current,
      });
      closeEditStory();
      setIsBusy(false);
    }
  }, [
    closeEditStory,
    getEditStoryValues,
    id,
    isEditStoryValid,
    isOwner,
    selectedEditStoryIndex,
  ]);

  const handleOpenRemoveStory = useCallback(
    (selectedIndex: number) => {
      setSelectedEditStoryIndex(selectedIndex);
      onOpenRemoveStory();
    },
    [onOpenRemoveStory]
  );

  const closeRemoveStory = useCallback(() => {
    setSelectedEditStoryIndex(undefined);
    onCloseRemoveStory();
  }, [onCloseRemoveStory]);

  const processRemoveStory = useCallback(async () => {
    if (isOwner && selectedEditStoryIndex !== undefined) {
      setIsBusy(true);
      await removeQueueItem({
        roomId: id,
        selectedQueueIndex: selectedEditStoryIndex,
        queue: queueRef.current,
      });
      closeRemoveStory();
      setIsBusy(false);
    }
  }, [closeRemoveStory, id, isOwner, selectedEditStoryIndex]);

  const handleRewriteQueue = useCallback(
    async (updatedQueue: Array<SortableTaskItemType>) => {
      if (isOwner) {
        const updated: Array<Task> = updatedQueue.map((queueItem) => ({
          ...queueItem,
        }));
        if (!isEqual(queueRef.current, updated)) {
          await rewriteQueue(id, updated);
        }
      }
    },
    [id, isOwner]
  );

  const handleClickSwap = useCallback(
    async (selectedQueueIndex: number) => {
      if (isOwner) {
        if (showVote) {
          toaster.create({
            description:
              'Cannot swap now as current story is already voted by all participants. Either finish or reset vote of current story to be able to swap.',
            type: 'warning',
          });
          return;
        }
        await swapSelectedQueueWithCurrent({
          roomId: id,
          task: taskRef.current,
          selectedQueueIndex,
          queue: queueRef.current,
        });
      }
    },
    [id, isOwner, showVote]
  );

  // Note: DnD sensors and drag handlers are now in the dynamically imported SortableQueue component

  return (
    <>
      <SpokerWrapperGrid>
        <Tabs.Root
          colorPalette="gray"
          css={{
            '--tabs-trigger-radius': 'radii.xl',
          }}
          onValueChange={(details) => setSelectedTabIndex(details.value)}
          value={selectedTabIndex}
          variant="subtle"
        >
          <Tabs.List alignItems="center" flexWrap="wrap" w="full">
            {isOwner && (
              <Tabs.Trigger color={tabTextColor} value="active">
                {tabTexts.activeStoriesTabText}
              </Tabs.Trigger>
            )}
            <Tabs.Trigger color={tabTextColor} value="completed">
              {tabTexts.completedTabText}
            </Tabs.Trigger>
            <Tabs.Trigger color={tabTextColor} value="all">
              {tabTexts.allTabText}
            </Tabs.Trigger>
            {isOwner && (
              <Button
                colorPalette="blue"
                marginLeft="auto"
                onClick={onOpenAddStory}
                size="md"
              >
                {buttonContent}
              </Button>
            )}
          </Tabs.List>

          <Tabs.ContentGroup>
            {isOwner && (
              <Tabs.Content
                display="flex"
                flexDir="column"
                gap={2}
                value="active"
              >
                <SortableQueue
                  onClickEdit={handleOpenEditStory}
                  onClickRemove={handleOpenRemoveStory}
                  onClickSwap={handleClickSwap}
                  onRewriteQueue={handleRewriteQueue}
                  sortableQueue={sortableQueue}
                  task={task}
                />
              </Tabs.Content>
            )}
            <Tabs.Content value="completed">
              {completed?.map((completedItem) => (
                <CompletedTaskItem
                  key={completedItem.id}
                  task={completedItem}
                />
              ))}
            </Tabs.Content>
            <Tabs.Content value="all">
              {all.map((task) => (
                <CompletedTaskItem key={task.id} task={task} />
              ))}
            </Tabs.Content>
          </Tabs.ContentGroup>
        </Tabs.Root>
      </SpokerWrapperGrid>

      <Modal.Provider
        onOpenChange={({ open }) => {
          if (!open) {
            onCloseAddStory();
          }
        }}
        open={isOpenAddStory}
      >
        <Modal.Content
          contentWrapperProps={{
            as: 'form',
            onSubmit: handleSubmit(handleAddStory),
          }}
        >
          <Modal.Header>Add Story</Modal.Header>
          <Modal.Body>
            <Grid gap={4}>
              <Text>Add story to queue</Text>
              <AutoResizeTextarea
                {...register('name')}
                errorText={errors.name?.message}
                invalid={!!errors.name?.message}
                label="Name"
                required
              />
              <AutoResizeTextarea
                {...register('description')}
                label="Description"
              />
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Flex gap={2}>
              <Button disabled={isBusy} onClick={onCloseAddStory}>
                Cancel
              </Button>
              <Button
                colorPalette="teal"
                disabled={!isValid || isBusy}
                loading={isBusy}
                type="submit"
              >
                Add
              </Button>
            </Flex>
          </Modal.Footer>
          <Modal.CloseTrigger />
        </Modal.Content>
      </Modal.Provider>

      <Modal.Provider
        onOpenChange={({ open }) => {
          if (!open) {
            closeEditStory();
          }
        }}
        open={isOpenEditStory}
      >
        <Modal.Content
          contentWrapperProps={{
            as: 'form',
            onSubmit: handleSubmitEditStory(processEditStory),
          }}
        >
          <Modal.Header>Edit Story</Modal.Header>
          <Modal.Body>
            <Grid gap={4}>
              <AutoResizeTextarea
                {...registerEditStoryField('name')}
                errorText={editStoryErrors.name?.message}
                invalid={!!editStoryErrors.name?.message}
                label="Name"
                required
              />
              <AutoResizeTextarea
                {...registerEditStoryField('description')}
                label="Description"
              />
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Flex gap={2}>
              <Button disabled={isBusy} onClick={closeEditStory}>
                Cancel
              </Button>
              <Button
                colorPalette="blue"
                disabled={!(isEditStoryValid && isEditStoryDirty) || isBusy}
                loading={isBusy}
                type="submit"
              >
                Save
              </Button>
            </Flex>
          </Modal.Footer>
          <Modal.CloseTrigger />
        </Modal.Content>
      </Modal.Provider>

      <Modal.Provider
        onOpenChange={({ open }) => {
          if (!open) {
            closeRemoveStory();
          }
        }}
        open={isOpenRemoveStory}
      >
        <Modal.Content>
          <Modal.Header>Confirm Remove Story</Modal.Header>
          <Modal.Body>
            <Box>
              <Text>
                Are you sure you want to remove{' '}
                {queue?.[selectedEditStoryIndex ?? 0]?.name ?? ''}?
              </Text>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Flex gap={2}>
              <Button onClick={closeRemoveStory}>Cancel</Button>
              <Button
                colorPalette="red"
                disabled={isBusy}
                loading={isBusy}
                onClick={processRemoveStory}
              >
                Yes, Remove
              </Button>
            </Flex>
          </Modal.Footer>
          <Modal.CloseTrigger />
        </Modal.Content>
      </Modal.Provider>
    </>
  );
};
