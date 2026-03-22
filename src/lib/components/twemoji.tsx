import { memo } from 'react';
import twemoji from 'twemoji';

interface TwemojiProps {
  emoji: string;
}

export const Twemoji = memo(({ emoji }: TwemojiProps) => {
  return (
    <span
      // biome-ignore lint/security/noDangerouslySetInnerHtml: twemoji.parse only processes emoji strings
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
