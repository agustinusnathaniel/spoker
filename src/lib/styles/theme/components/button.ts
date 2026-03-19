import type { ComponentStyleConfig } from '@chakra-ui/react';

export const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: 12,
    border: '2px solid black',
    boxShadow: '0px 6px 0px black',
    marginY: 1,
  },
  defaultProps: {
    size: 'lg',
  },
};
