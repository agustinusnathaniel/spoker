'use client';

import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Popover,
  Portal,
  Text,
} from '@chakra-ui/react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import { ImCheckmark } from 'react-icons/im';
import { IoMdPerson } from 'react-icons/io';

import { SpokerInput } from '~/lib/components/spoker-input';
import { toaster } from '~/lib/components/ui/toaster';
import { PRIVATE_ROUTES } from '~/lib/constants/routes/private';
import { EVENT_TYPE_AUTH } from '~/lib/constants/tracking';
import { logoutUser } from '~/lib/services/firebase/auth/logout';
import { updateDisplayName } from '~/lib/services/firebase/auth/update-display-name';
import { disconnectUser } from '~/lib/services/firebase/room/update/disconnect-user';
import { useAuthStoreAction, useAuthStoreState } from '~/lib/stores/auth';
import { removeFirebasePrefix } from '~/lib/utils/remove-firebase-prefix';
import { trackEvent } from '~/lib/utils/track-event';

export const AuthPopover = () => {
  const { currentUser, displayName } = useAuthStoreState();
  const { setDisplayName } = useAuthStoreAction();
  const [isEditingDisplayName, setIsEditingDisplayName] =
    useState<boolean>(false);
  const [displayNameInput, setDisplayNameInput] = useState<string>('');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const id = params?.id as string;

  const handleEditClick = () => {
    if (isEditingDisplayName) {
      if (displayNameInput !== displayName) {
        updateDisplayName(displayNameInput)
          .then(() => {
            toaster.create({
              title: 'Update name successful',
              type: 'success',
            });
            setDisplayName(displayNameInput);
          })
          .catch((e) => {
            toaster.create({
              description: removeFirebasePrefix(e.message),
              type: 'error',
            });
          })
          .finally(() => {
            setIsEditingDisplayName(false);
          });
        return;
      }

      setIsEditingDisplayName(false);
      return;
    }

    setDisplayNameInput(displayName);
    setIsEditingDisplayName(true);
  };

  const processLogout = async () => {
    await logoutUser().then(() => {
      toaster.create({
        description: 'Successfully logged out',
        type: 'info',
      });
    });
  };

  const clearUserSessionData = async () => {
    if (id && PRIVATE_ROUTES.includes(pathname) && currentUser) {
      await disconnectUser(id, currentUser.uid);
      router.push('/');
    }

    await processLogout();
  };

  const handleLogout = async () => {
    await clearUserSessionData();
    trackEvent({
      eventName: 'sign out',
      eventData: { type: EVENT_TYPE_AUTH },
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <Box>
      <Popover.Root positioning={{ placement: 'bottom-end' }}>
        <Popover.Trigger asChild>
          <IconButton
            aria-label="account"
            backgroundColor={{ _dark: 'gray.500' }}
            size="md"
            variant="ghost"
          >
            <IoMdPerson />
          </IconButton>
        </Popover.Trigger>

        <Portal>
          <Popover.Positioner>
            <Popover.Content>
              <Popover.Body>
                <Flex alignItems="center" gap={2}>
                  {isEditingDisplayName ? (
                    <SpokerInput
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      size="sm"
                      value={displayNameInput}
                    />
                  ) : (
                    <Heading size="lg">{displayName}</Heading>
                  )}
                  <IconButton
                    aria-label="edit"
                    onClick={handleEditClick}
                    size="xs"
                    variant="ghost"
                  >
                    {isEditingDisplayName ? <ImCheckmark /> : <BsPencil />}
                  </IconButton>
                </Flex>
                <Text color="gray" fontSize="sm" mb={4}>
                  {currentUser.email}
                </Text>
                <Button
                  colorPalette="red"
                  onClick={handleLogout}
                  size="md"
                  width="full"
                >
                  Sign Out
                </Button>
              </Popover.Body>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </Box>
  );
};
