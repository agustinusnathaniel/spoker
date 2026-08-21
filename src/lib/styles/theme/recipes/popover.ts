import { defineSlotRecipe } from '@chakra-ui/react';
import { popoverAnatomy } from '@chakra-ui/react/anatomy';

export const popoverRecipe = defineSlotRecipe({
  base: {
    content: {
      border: '2px solid',
      borderColor: 'border.emphasized',
      borderRadius: '16px',
      boxShadow: '0px 6px 0px {colors.border.emphasized}',
      marginY: 1,
    },
    header: {
      borderBottomWidth: 0,
    },
  },
  className: 'chakra-popover',
  slots: popoverAnatomy.keys(),
});
