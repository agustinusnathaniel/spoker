'use client';

import Link from 'next/link';

import { EVENT_TYPE_AUTH } from '~/lib/constants/tracking';
import { trackEvent } from '~/lib/utils/track-event';

export const ForgotPasswordButton = () => {
  const handleClickForgotPassword = () => {
    trackEvent({
      eventData: { type: EVENT_TYPE_AUTH },
      eventName: 'open reset password',
    });
  };

  return (
    <Link
      href="/reset-password"
      onClick={handleClickForgotPassword}
      style={{ fontSize: 'sm' }}
    >
      Forgot Password
    </Link>
  );
};
