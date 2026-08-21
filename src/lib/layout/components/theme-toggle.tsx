'use client';

import { IconButton } from '@chakra-ui/react';
import { RiMoonFill, RiSunLine } from 'react-icons/ri';

import { useColorMode } from '~/lib/components/ui/color-mode';
import { EVENT_TYPE_CTA } from '~/lib/constants/tracking';
import { trackEvent } from '~/lib/utils/track-event';

export const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const handleClickToggle = () => {
    trackEvent({
      eventData: { type: EVENT_TYPE_CTA },
      eventName: `toggle theme to ${colorMode === 'light' ? 'dark' : 'light'}`,
    });
    toggleColorMode();
  };

  return (
    <IconButton
      aria-label="theme toggle"
      backgroundColor={{ _dark: 'gray.500' }}
      onClick={handleClickToggle}
      size="md"
      variant="ghost"
    >
      {colorMode === 'light' ? <RiMoonFill /> : <RiSunLine />}
    </IconButton>
  );
};
