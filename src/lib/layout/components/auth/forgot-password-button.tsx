import { Button } from '@chakra-ui/react';
import Link from 'next/link';

import { EVENT_TYPE_AUTH } from '~/lib/constants/tracking';
import { trackEvent } from '~/lib/utils/track-event';

export const ForgotPasswordButton = () => {
  const handleClickForgotPassword = () => {
    trackEvent({
      eventName: 'open reset password',
      eventData: { type: EVENT_TYPE_AUTH },
    });
  };

  return (
    <Button
      as={Link}
      border="none"
      boxShadow="none"
      href="/reset-password"
      onClick={handleClickForgotPassword}
      size="sm"
      variant="ghost"
    >
      Forgot Password
    </Button>
  );
};
