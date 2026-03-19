import type { ComponentStyleConfig } from '@chakra-ui/react';

export const Popover: ComponentStyleConfig = {
  baseStyle: {
    content: {
      borderRadius: 16,
      border: '2px solid black !important',
      boxShadow: '0px 6px 0px black',
      marginY: 1,
    },
    header: {
      borderBottomWidth: 0,
    },
  },
};
