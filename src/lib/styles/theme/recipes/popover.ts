import { defineSlotRecipe } from '@chakra-ui/react';
import { popoverAnatomy } from '@chakra-ui/react/anatomy';

export const popoverRecipe = defineSlotRecipe({
  className: 'chakra-popover',
  slots: popoverAnatomy.keys(),
  base: {
    content: {
      borderRadius: '16px',
      border: '2px solid black',
      boxShadow: '0px 6px 0px black',
      marginY: 1,
    },
    header: {
      borderBottomWidth: 0,
    },
  },
});
