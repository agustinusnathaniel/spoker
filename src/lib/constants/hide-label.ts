enum HideLabelOptions {
  monkey = 'monkey',
  chicken = 'chicken',
  cow = 'cow',
  fish = 'fish',
  money = 'money',
  cloud = 'cloud',
  shrimp = 'shrimp',
  think = 'think',
}

export type HideLabelOptionsType = keyof typeof HideLabelOptions;

export const hideLabelOptions: Array<HideLabelOptionsType> = Object.keys(
  HideLabelOptions
)
  .filter((label) => Number.isNaN(Number(label)))
  .map((labelOption) => labelOption as HideLabelOptionsType);

type HideLabelType = Record<
  HideLabelOptionsType,
  {
    empty: string;
    selected: string;
  }
>;

export const hideLabel: HideLabelType = {
  monkey: {
    empty: '🙊',
    selected: '🙉',
  },
  chicken: {
    empty: '🥚',
    selected: '🐣',
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
  cloud: {
    empty: '☁️',
    selected: '⛅',
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
