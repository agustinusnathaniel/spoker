import { createSystem, defaultConfig } from '@chakra-ui/react';

import { tabsRecipe } from '~/lib/styles/theme/recipes/tabs';

import { buttonRecipe } from './recipes/button';
import { popoverRecipe } from './recipes/popover';

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        gray: {
          50: { value: '#e9e9ea' },
          100: { value: '#d3d3d4' },
          200: { value: '#a6a8a9' },
          300: { value: '#7a7c7f' },
          400: { value: '#4d5154' },
          500: { value: '#212529' },
          600: { value: '#1a1e21' },
          700: { value: '#141619' },
          800: { value: '#0d0f10' },
          900: { value: '#070708' },
          950: { value: '#030303' },
        },
        blue: {
          50: { value: '#f4f8fa' },
          100: { value: '#e5eef4' },
          200: { value: '#d1e2ec' },
          300: { value: '#b1cfdf' },
          400: { value: '#8cb6ce' },
          500: { value: '#6a99be' },
          600: { value: '#5d87b3' },
          700: { value: '#5276a3' },
          800: { value: '#476186' },
          900: { value: '#3d516b' },
          950: { value: '#2d3a4d' },
        },
        cyan: {
          50: { value: '#f1faf9' },
          100: { value: '#dbf2f2' },
          200: { value: '#bbe6e6' },
          300: { value: '#8cd2d4' },
          400: { value: '#56b5ba' },
          500: { value: '#40a9b0' },
          600: { value: '#337e87' },
          700: { value: '#2f666f' },
          800: { value: '#2d555d' },
          900: { value: '#294850' },
          950: { value: '#1a2f36' },
        },
        teal: {
          50: { value: '#f2fbf8' },
          100: { value: '#d3f4e9' },
          200: { value: '#a7e8d4' },
          300: { value: '#73d5ba' },
          400: { value: '#40b094' },
          500: { value: '#2ca085' },
          600: { value: '#21806c' },
          700: { value: '#1e6758' },
          800: { value: '#1c5348' },
          900: { value: '#1c453e' },
          950: { value: '#122e2a' },
        },
        green: {
          50: { value: '#eefbf2' },
          100: { value: '#d7f4de' },
          200: { value: '#b1e9c1' },
          300: { value: '#7fd69e' },
          400: { value: '#40b06b' },
          500: { value: '#27a25a' },
          600: { value: '#198247' },
          700: { value: '#14683b' },
          800: { value: '#125331' },
          900: { value: '#104429' },
          950: { value: '#0b2e1c' },
        },
      },
      fonts: {
        heading: { value: 'Gabarito, sans-serif' },
        body: { value: 'Gantari, sans-serif' },
      },
    },
    recipes: {
      button: buttonRecipe,
    },
    slotRecipes: {
      popover: popoverRecipe,
      tabs: tabsRecipe,
    },
  },
});
