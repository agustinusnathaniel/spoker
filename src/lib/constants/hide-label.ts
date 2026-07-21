const HideLabelOptions = {
  chicken: 'chicken',
  cloud: 'cloud',
  cow: 'cow',
  fish: 'fish',
  money: 'money',
  monkey: 'monkey',
  shrimp: 'shrimp',
  think: 'think',
} as const;

export type HideLabelOptionsType = keyof typeof HideLabelOptions;

export const hideLabelOptions: Array<HideLabelOptionsType> =
  Object.values(HideLabelOptions);

type HideLabelType = Record<
  HideLabelOptionsType,
  {
    empty: string;
    selected: string;
  }
>;

export const hideLabel: HideLabelType = {
  chicken: {
    empty: '🥚',
    selected: '🐣',
  },
  cloud: {
    empty: '☁️',
    selected: '⛅',
  },
  cow: {
    empty: '🐄',
    selected: '🥛',
  },
  fish: {
    empty: '🐟',
    selected: '🎣',
  },
  money: {
    empty: '💸',
    selected: '💰',
  },
  monkey: {
    empty: '🙊',
    selected: '🙉',
  },
  shrimp: {
    empty: '🦐',
    selected: '🍤',
  },
  think: {
    empty: '🤔',
    selected: '👌',
  },
};
