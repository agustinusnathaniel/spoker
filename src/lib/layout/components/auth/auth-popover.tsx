import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useBreakpointValue,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BsPencil } from 'react-icons/bs';
import { ImCheckmark } from 'react-icons/im';
import { IoMdPerson } from 'react-icons/io';

import { SpokerInput } from '~/lib/components/spoker-input';
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
  const toast = useToast();
  const router = useRouter();
  const buttonSize = useBreakpointValue({
    base: 'md',
    sm: 'lg',
  });

  const {
    query: { id },
    pathname,
  } = router;

  const handleEditClick = () => {
    if (isEditingDisplayName) {
      if (displayNameInput !== displayName) {
        updateDisplayName(displayNameInput)
          .then(() => {
            toast({
              title: 'Update name successful',
              status: 'success',
              position: 'top',
              isClosable: true,
            });
            setDisplayName(displayNameInput);
          })
          .catch((e) => {
            toast({
              description: removeFirebasePrefix(e.message),
              status: 'error',
              position: 'top',
              isClosable: true,
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
      toast({
        description: 'Successfully logged out',
        status: 'info',
        position: 'top',
      });
    });
  };

  const clearUserSessionData = async () => {
    if (id && PRIVATE_ROUTES.includes(pathname) && currentUser) {
      await disconnectUser(id as string, currentUser.uid);
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
      <Popover
        onClose={() => setIsEditingDisplayName(false)}
        placement="bottom-end"
      >
        <PopoverTrigger>
          <IconButton
            aria-label="account"
            icon={<IoMdPerson />}
            size={buttonSize}
          />
        </PopoverTrigger>

        <PopoverContent>
          <PopoverCloseButton />
          <PopoverHeader>
            <Flex alignItems="center" gridGap={2}>
              {isEditingDisplayName ? (
                <SpokerInput
                  formControlWidth="70%"
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  size="sm"
                  value={displayNameInput}
                />
              ) : (
                <Heading size="sm">{displayName}</Heading>
              )}
              <IconButton
                aria-label="edit"
                border="none"
                boxShadow="none"
                icon={isEditingDisplayName ? <ImCheckmark /> : <BsPencil />}
                onClick={handleEditClick}
                size="xs"
              />
            </Flex>
            <Text color="gray" fontSize="sm">
              {currentUser.email}
            </Text>
          </PopoverHeader>
          <PopoverBody>
            <Button
              colorScheme="red"
              onClick={handleLogout}
              size="md"
              width="full"
            >
              Sign Out
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
