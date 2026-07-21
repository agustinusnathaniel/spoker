import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  base: {
    border: '2px solid black',
    borderRadius: '12px',
    boxShadow: '0px 6px 0px black',
    marginY: 1,
  },
  className: 'chakra-button',
  defaultVariants: {
    size: 'lg',
  },
  variants: {
    size: {
      lg: {
        // Keep default lg styles but override if needed
      },
    },
  },
});
