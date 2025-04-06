import { memo } from 'react';
import twemoji from 'twemoji';

type TwemojiProps = {
  emoji: string;
};

export const Twemoji = memo(({ emoji }: TwemojiProps) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(emoji, {
          folder: 'svg',
          ext: '.svg',
          base: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/',
        }),
      }}
    />
  );
});

Twemoji.displayName = 'Twemoji';
