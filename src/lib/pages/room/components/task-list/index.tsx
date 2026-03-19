import type { TabProps } from '@chakra-ui/react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  useBreakpointValue,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import isEqual from 'react-fast-compare';
import { useForm } from 'react-hook-form';
import { GoPlus } from 'react-icons/go';
import { RiInformationLine } from 'react-icons/ri';
import { ReactSortable } from 'react-sortablejs';
import { useShallow } from 'zustand/shallow';

import { AutoResizeTextarea } from '~/lib/components/auto-resize-textarea';
import { SpokerModalWrapper } from '~/lib/components/spoker-modal-wrapper';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { emptyRoom } from '~/lib/constants/empty-room';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { submitStoryFormValidationSchema } from '~/lib/models/task-list';
import { editQueueItem } from '~/lib/services/firebase/room/update/queue/edit';
import { removeQueueItem } from '~/lib/services/firebase/room/update/queue/remove';
import { swapSelectedQueueWithCurrent } from '~/lib/services/firebase/room/update/queue/swap';
import { rewriteQueue } from '~/lib/services/firebase/room/update/rewrite-queue';
import { useRoomStore } from '~/lib/stores/room';
import type { Task } from '~/lib/types/raw-db';

import { TaskItem } from './task-item';
import type { SortableTaskItem, UpsertStoryForm } from './types';

const initialFormValue: UpsertStoryForm = {
  name: '',
  description: '',
};

const tabStyle: TabProps = {
  fontSize: {
    base: 'xs',
    md: 'md',
  },
};

export const TaskList = () => {
  const router = useRouter();
  const {
    query: { id },
  } = router;

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
  const {
    isOpen: isOpenAddStory,
    onOpen: onOpenAddStory,
    onClose: onCloseAddStory,
  } = useDisclosure();
  const {
    isOpen: isOpenEditStory,
    onOpen: onOpenEditStory,
    onClose: onCloseEditStory,
  } = useDisclosure();
  const {
    isOpen: isOpenRemoveStory,
    onOpen: onOpenRemoveStory,
    onClose: onCloseRemoveStory,
  } = useDisclosure();
  const toast = useToast();
  const buttonContent = useBreakpointValue({
    base: <GoPlus />,
    md: 'Add Story',
  });
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const [isBusy, setIsBusy] = useState<boolean>();
  const [selectedEditStoryIndex, setSelectedEditStoryIndex] =
    useState<number>();

  const sortableQueue: Array<SortableTaskItem> = useMemo(() => {
    return (queue ?? []) as Array<SortableTaskItem>;
  }, [queue]);

  const all = useMemo(
    () => [task, ...(queue ?? []), ...(completed ?? [])],
    [completed, queue, task]
  );

  const activeStoriesLengthText = queue?.length
    ? ` (${queue.length + 1})`
    : ' (1)';
  const activeStoriesTabText = `Active${activeStoriesLengthText}`;
  const queueLengthText = queue?.length ? ` (${queue.length})` : '';
  const queueTabText = `Queue${queueLengthText}`;
  const completedLengthText = completed?.length ? ` (${completed.length})` : '';
  const completedTabText = `Completed${completedLengthText}`;
  const allLengthText = ` (${all.length})`;
  const allTabText = `All${allLengthText}`;

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

  const handleAddStory = useCallback(async () => {
    if (isValid && isOwner) {
      const values = getValues();
      const randomId = nanoid(21);
      setIsBusy(true);
      await rewriteQueue(id as string, [
        ...(queueRef.current ?? []),
        { ...values, id: randomId } as Task,
      ]);
      onCloseAddStory();
      setIsBusy(false);
      setSelectedTabIndex(0);
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
        roomId: id as string,
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
        roomId: id as string,
        selectedQueueIndex: selectedEditStoryIndex,
        queue: queueRef.current,
      });
      closeRemoveStory();
      setIsBusy(false);
    }
  }, [closeRemoveStory, id, isOwner, selectedEditStoryIndex]);

  const handleRewriteQueue = useCallback(
    async (updatedQueue: Array<SortableTaskItem>) => {
      if (isOwner) {
        const updated: Array<Task> = updatedQueue.map((queueItem) => {
          const temp = queueItem;
          temp.chosen = undefined;
          temp.selected = undefined;
          temp.filtered = undefined;
          return temp;
        });
        if (!isEqual(queueRef.current, updated)) {
          await rewriteQueue(id as string, updated);
        }
      }
    },
    [id, isOwner]
  );

  const handleClickSwap = useCallback(
    async (selectedQueueIndex: number) => {
      if (isOwner) {
        if (showVote) {
          toast({
            description:
              'Cannot swap now as current story is already voted by all participants. Either finish or reset vote of current story to be able to swap.',
            status: 'warning',
            position: 'top',
          });
          return;
        }
        await swapSelectedQueueWithCurrent({
          roomId: id as string,
          task: taskRef.current,
          selectedQueueIndex,
          queue: queueRef.current,
        });
      }
    },
    [id, isOwner, showVote, toast]
  );

  const handleChangeTab = (index: number) => setSelectedTabIndex(index);

  return (
    <>
      <SpokerWrapperGrid>
        <Tabs
          colorScheme="gray"
          index={selectedTabIndex}
          onChange={handleChangeTab}
          variant="soft-rounded"
        >
          <TabList alignItems="center">
            {isOwner && (
              <Tab {...tabStyle} color={tabTextColor}>
                {activeStoriesTabText}
              </Tab>
            )}
            <Tab {...tabStyle} color={tabTextColor}>
              {completedTabText}
            </Tab>
            <Tab {...tabStyle} color={tabTextColor}>
              {allTabText}
            </Tab>
            {isOwner && (
              <Button
                colorScheme="blue"
                marginLeft="auto"
                onClick={onOpenAddStory}
                size="md"
              >
                {buttonContent}
              </Button>
            )}
          </TabList>

          <TabPanels>
            {isOwner && (
              <TabPanel display="flex" flexDir="column" gap={2}>
                <Text>Current:</Text>
                <TaskItem task={task} />

                <Box>
                  <Tooltip label="Queue can be re-arranged using drag and drop, the first item will be the next story to be voted.">
                    <Text
                      _hover={{ cursor: 'help' }}
                      alignItems="center"
                      as="span"
                      fontWeight="semibold"
                      textDecoration="underline"
                    >
                      {queueTabText}: <Icon as={RiInformationLine} />
                    </Text>
                  </Tooltip>
                </Box>
                <ReactSortable
                  animation={200}
                  list={sortableQueue}
                  setList={handleRewriteQueue}
                >
                  {sortableQueue?.map((queueItem, index) => (
                    <TaskItem
                      key={queueItem.id}
                      queueProps={{
                        isQueue: true,
                        taskIndex: index,
                        onClickSwap: handleClickSwap,
                        onClickEdit: handleOpenEditStory,
                        onClickRemove: handleOpenRemoveStory,
                      }}
                      task={queueItem}
                    />
                  ))}
                </ReactSortable>
              </TabPanel>
            )}
            <TabPanel>
              {completed?.map((completedItem) => (
                <TaskItem key={completedItem.id} task={completedItem} />
              ))}
            </TabPanel>
            <TabPanel>
              {all.map((completedItem) => (
                <TaskItem key={completedItem.id} task={completedItem} />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SpokerWrapperGrid>

      <SpokerModalWrapper
        body={
          <Grid gap={4}>
            <Text>Add story to queue</Text>
            <AutoResizeTextarea
              {...register('name')}
              errorText={errors.name?.message}
              isInvalid={!!errors.name?.message}
              isRequired
              label="Name"
            />
            <AutoResizeTextarea
              {...register('description')}
              label="Description"
            />
          </Grid>
        }
        contentWrapperProps={{
          as: 'form',
          onSubmit: handleSubmit(handleAddStory),
        }}
        footer={
          <Flex gridGap={2}>
            <Button disabled={isBusy} onClick={onCloseAddStory}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              isDisabled={!isValid || isBusy}
              isLoading={isBusy}
              type="submit"
            >
              Add
            </Button>
          </Flex>
        }
        header="Add Story"
        isOpen={isOpenAddStory}
        onClose={onCloseAddStory}
      />

      <SpokerModalWrapper
        body={
          <Grid gap={4}>
            <AutoResizeTextarea
              {...registerEditStoryField('name')}
              errorText={editStoryErrors.name?.message}
              isInvalid={!!editStoryErrors.name?.message}
              isRequired
              label="Name"
            />
            <AutoResizeTextarea
              {...registerEditStoryField('description')}
              label="Description"
            />
          </Grid>
        }
        contentWrapperProps={{
          as: 'form',
          onSubmit: handleSubmitEditStory(processEditStory),
        }}
        footer={
          <Flex gridGap={2}>
            <Button disabled={isBusy} onClick={closeEditStory}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              isDisabled={!(isEditStoryValid && isEditStoryDirty) || isBusy}
              isLoading={isBusy}
              type="submit"
            >
              Save
            </Button>
          </Flex>
        }
        header="Edit Story"
        isOpen={isOpenEditStory}
        onClose={closeEditStory}
      />

      <SpokerModalWrapper
        body={
          <Box>
            <Text>
              Are you sure you want to remove{' '}
              {queue?.[selectedEditStoryIndex ?? 0]?.name ?? ''}?
            </Text>
          </Box>
        }
        footer={
          <Flex gridGap={2}>
            <Button onClick={closeRemoveStory}>Cancel</Button>
            <Button
              colorScheme="red"
              isDisabled={isBusy}
              isLoading={isBusy}
              onClick={processRemoveStory}
            >
              Yes, Remove
            </Button>
          </Flex>
        }
        header="Confirm Remove Story"
        isOpen={isOpenRemoveStory}
        onClose={closeRemoveStory}
      />
    </>
  );
};
