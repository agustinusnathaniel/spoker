import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  className: 'chakra-button',
  base: {
    borderRadius: '12px',
    border: '2px solid black',
    boxShadow: '0px 6px 0px black',
    marginY: 1,
  },
  variants: {
    size: {
      lg: {
        // Keep default lg styles but override if needed
      },
    },
  },
  defaultVariants: {
    size: 'lg',
  },
});
