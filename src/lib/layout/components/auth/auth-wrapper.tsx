import { Modal, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import * as React from 'react';

import { PUBLIC_ROUTES } from '~/lib/constants/routes/public';
import { RESTRICTED_ROUTES } from '~/lib/constants/routes/restricted';
import { EVENT_TYPE_AUTH } from '~/lib/constants/tracking';
import { useAuthStoreState } from '~/lib/stores/auth';
import { trackEvent } from '~/lib/utils/trackEvent';

import { Login } from './login';
import { Register } from './register';

type AuthWrapperProps = {
  children: ReactNode;
};

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isRegistered, setIsRegistered] = React.useState<boolean>(true);
  const { currentUser } = useAuthStoreState();

  const router = useRouter();
  const { pathname } = router;
  const isPublicRoute = PUBLIC_ROUTES.indexOf(pathname) >= 0;
  const isRestrictedRoute = RESTRICTED_ROUTES.includes(pathname);

  const isUnauthorized =
    currentUser === null && !isPublicRoute && !isRestrictedRoute;

  React.useEffect(() => {
    if (isUnauthorized) {
      onOpen();
    } else {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, pathname]);

  React.useEffect(() => {
    if (!isUnauthorized) {
      setIsRegistered(true);
    }
  }, [isUnauthorized]);

  const handleSwitchToRegister = () => setIsRegistered(false);
  const handleSwitchToLogin = () => setIsRegistered(true);

  const handleCloseAuthModal = () => {
    router.push({ pathname: '/home' });
    trackEvent({
      eventName: 'close_auth-back_to_home',
      eventData: { type: EVENT_TYPE_AUTH },
    });
  };

  if (!isUnauthorized) {
    return children as React.ReactElement;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseAuthModal}
      motionPreset="slideInBottom"
      isCentered
      size="md"
    >
      <ModalOverlay />

      {isRegistered ? (
        <Login {...{ handleSwitchToRegister }} />
      ) : (
        <Register {...{ handleSwitchToLogin }} />
      )}
    </Modal>
  );
};
