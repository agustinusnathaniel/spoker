import { defineSlotRecipe } from '@chakra-ui/react';
import { tabsAnatomy } from '@chakra-ui/react/anatomy';

export const tabsRecipe = defineSlotRecipe({
  base: {
    trigger: {
      borderRadius: 24,
    },
  },
  className: 'chakra-tabs',
  slots: tabsAnatomy.keys(),
});
