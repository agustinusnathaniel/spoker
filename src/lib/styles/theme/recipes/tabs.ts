import { defineSlotRecipe } from '@chakra-ui/react';
import { tabsAnatomy } from '@chakra-ui/react/anatomy';

export const tabsRecipe = defineSlotRecipe({
  className: 'chakra-tabs',
  slots: tabsAnatomy.keys(),
  base: {
    trigger: {
      borderRadius: 24,
    },
  },
});
