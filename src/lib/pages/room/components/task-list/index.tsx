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
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useForm } from 'react-hook-form';
import { GoPlus } from 'react-icons/go';
import { RiInformationLine } from 'react-icons/ri';
import { ReactSortable } from 'react-sortablejs';

import { AutoResizeTextarea } from '~/lib/components/auto-resize-textarea';
import { SpokerModalWrapper } from '~/lib/components/spoker-modal-wrapper';
import { SpokerWrapperGrid } from '~/lib/components/spoker-wrapper-grid';
import { useUserRole } from '~/lib/hooks/use-user-role';
import { submitStoryFormValidationSchema } from '~/lib/models/task-list';
import { editQueueItem } from '~/lib/services/firebase/room/update/queue/edit';
import { removeQueueItem } from '~/lib/services/firebase/room/update/queue/remove';
import { swapSelectedQueueWithCurrent } from '~/lib/services/firebase/room/update/queue/swap';
import { rewriteQueue } from '~/lib/services/firebase/room/update/rewrite-queue';
import { useRoomStoreState } from '~/lib/stores/room';
import type { Task } from '~/lib/types/raw-db';

import { TaskItem } from './task-item';
import type { SortableTaskItem, UpsertStoryForm } from './types';
import { emptyRoom } from '~/lib/constants/empty-room';

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
  const { roomData = emptyRoom, showVote } = useRoomStoreState();
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
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);
  const [isBusy, setIsBusy] = React.useState<boolean>();
  const [selectedEditStoryIndex, setSelectedEditStoryIndex] =
    React.useState<number>();
  const { queue, completed, task } = roomData;

  const sortableQueue: Array<SortableTaskItem> = React.useMemo(() => {
    return (queue ?? []) as Array<SortableTaskItem>;
  }, [queue]);

  const all = React.useMemo(
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
  } = useForm<UpsertStoryForm>({
    resolver: zodResolver(submitStoryFormValidationSchema),
    mode: 'onChange',
  });

  const handleAddStory = async () => {
    if (isValid && isOwner) {
      const values = getValues();
      const randomId = nanoid(21);
      setIsBusy(true);
      await rewriteQueue(id as string, [
        ...(queue ?? []),
        { ...values, id: randomId } as Task,
      ]);
      onCloseAddStory();
      setIsBusy(false);
      setSelectedTabIndex(0);
      reset();
    }
  };

  const handleOpenEditStory = (selectedIndex: number) => {
    setSelectedEditStoryIndex(selectedIndex);
    const selectedQueueItem = queue?.[selectedIndex];
    resetEditStoryForm({
      name: selectedQueueItem?.name,
      description: selectedQueueItem?.description,
    });
    onOpenEditStory();
  };

  const closeEditStory = () => {
    setSelectedEditStoryIndex(undefined);
    onCloseEditStory();
    resetEditStoryForm();
  };

  const processEditStory = async () => {
    if (isOwner && selectedEditStoryIndex !== undefined && isEditStoryValid) {
      const values = getEditStoryValues();
      setIsBusy(true);
      await editQueueItem({
        roomId: id as string,
        updatedItem: values as Task,
        selectedQueueIndex: selectedEditStoryIndex,
        queue,
      });
      closeEditStory();
      setIsBusy(false);
    }
  };

  const handleOpenRemoveStory = (selectedIndex: number) => {
    setSelectedEditStoryIndex(selectedIndex);
    onOpenRemoveStory();
  };

  const closeRemoveStory = () => {
    setSelectedEditStoryIndex(undefined);
    onCloseRemoveStory();
  };

  const processRemoveStory = async () => {
    if (isOwner && selectedEditStoryIndex !== undefined) {
      setIsBusy(true);
      await removeQueueItem({
        roomId: id as string,
        selectedQueueIndex: selectedEditStoryIndex,
        queue,
      });
      closeRemoveStory();
      setIsBusy(false);
    }
  };

  const handleRewriteQueue = async (updatedQueue: Array<SortableTaskItem>) => {
    if (isOwner) {
      const updated: Array<Task> = updatedQueue.map((queueItem) => {
        const temp = queueItem;
        delete temp.chosen;
        delete temp.selected;
        delete temp.filtered;
        return temp;
      });
      if (!isEqual(queue, updated)) {
        await rewriteQueue(id as string, updated);
      }
    }
  };

  const handleClickSwap = async (selectedQueueIndex: number) => {
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
        task,
        selectedQueueIndex,
        queue,
      });
    }
  };

  const handleChangeTab = (index: number) => setSelectedTabIndex(index);

  return (
    <>
      <SpokerWrapperGrid>
        <Tabs
          index={selectedTabIndex}
          onChange={handleChangeTab}
          variant="soft-rounded"
          colorScheme="gray"
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
                marginLeft="auto"
                size="md"
                colorScheme="facebook"
                onClick={onOpenAddStory}
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
                      as="span"
                      _hover={{ cursor: 'help' }}
                      textDecoration="underline"
                      fontWeight="semibold"
                      alignItems="center"
                    >
                      {queueTabText}: <Icon as={RiInformationLine} />
                    </Text>
                  </Tooltip>
                </Box>
                <ReactSortable
                  list={sortableQueue}
                  setList={handleRewriteQueue}
                  animation={200}
                >
                  {sortableQueue?.map((queueItem, index) => (
                    <TaskItem
                      task={queueItem}
                      key={queueItem.id}
                      queueProps={{
                        isQueue: true,
                        taskIndex: index,
                        onClickSwap: handleClickSwap,
                        onClickEdit: handleOpenEditStory,
                        onClickRemove: handleOpenRemoveStory,
                      }}
                    />
                  ))}
                </ReactSortable>
              </TabPanel>
            )}
            <TabPanel>
              {completed?.map((completedItem) => (
                <TaskItem task={completedItem} key={completedItem.id} />
              ))}
            </TabPanel>
            <TabPanel>
              {all.map((completedItem) => (
                <TaskItem task={completedItem} key={completedItem.id} />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SpokerWrapperGrid>

      <SpokerModalWrapper
        isOpen={isOpenAddStory}
        onClose={onCloseAddStory}
        header="Add Story"
        contentWrapperProps={{
          as: 'form',
          onSubmit: handleSubmit(handleAddStory),
        }}
        body={
          <Grid gap={4}>
            <Text>Add story to queue</Text>
            <AutoResizeTextarea
              {...register('name')}
              isRequired
              label="Name"
              isInvalid={!!errors.name?.message}
              errorText={errors.name?.message}
            />
            <AutoResizeTextarea
              {...register('description')}
              label="Description"
            />
          </Grid>
        }
        footer={
          <Flex gridGap={2}>
            <Button onClick={onCloseAddStory} disabled={isBusy}>
              Cancel
            </Button>
            <Button
              colorScheme="teal"
              type="submit"
              isDisabled={!isValid || isBusy}
              isLoading={isBusy}
            >
              Add
            </Button>
          </Flex>
        }
      />

      <SpokerModalWrapper
        isOpen={isOpenEditStory}
        onClose={closeEditStory}
        header="Edit Story"
        contentWrapperProps={{
          as: 'form',
          onSubmit: handleSubmitEditStory(processEditStory),
        }}
        body={
          <Grid gap={4}>
            <AutoResizeTextarea
              {...registerEditStoryField('name')}
              isRequired
              label="Name"
              isInvalid={!!editStoryErrors.name?.message}
              errorText={editStoryErrors.name?.message}
            />
            <AutoResizeTextarea
              {...registerEditStoryField('description')}
              label="Description"
            />
          </Grid>
        }
        footer={
          <Flex gridGap={2}>
            <Button onClick={closeEditStory} disabled={isBusy}>
              Cancel
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isDisabled={!isEditStoryValid || !isEditStoryDirty || isBusy}
              isLoading={isBusy}
            >
              Save
            </Button>
          </Flex>
        }
      />

      <SpokerModalWrapper
        isOpen={isOpenRemoveStory}
        onClose={closeRemoveStory}
        header="Confirm Remove Story"
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
              onClick={processRemoveStory}
              isLoading={isBusy}
              isDisabled={isBusy}
            >
              Yes, Remove
            </Button>
          </Flex>
        }
      />
    </>
  );
};
