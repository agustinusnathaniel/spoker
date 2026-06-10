import type { ComponentType } from 'react';

import V100 from './v1.0.0.mdx';
import V110 from './v1.1.0.mdx';
import V120 from './v1.2.0.mdx';
import V130 from './v1.3.0.mdx';
import V150 from './v1.5.0.mdx';
import V160 from './v1.6.0.mdx';
import V180 from './v1.8.0.mdx';
import V1100 from './v1.10.0.mdx';
import V1120 from './v1.12.0.mdx';
import V1140 from './v1.14.0.mdx';
import V1150 from './v1.15.0.mdx';
import V1170 from './v1.17.0.mdx';

export interface ChangelogEntry {
  content: ComponentType;
  date: string;
  slug: string;
  tag: 'new' | 'improved' | 'fixed';
  title: string;
  version: string;
}

export const entries: Array<ChangelogEntry> = [
  {
    version: '1.17.0',
    date: '2026-03-22',
    tag: 'new',
    title: 'Modern Makeover',
    slug: 'v1.17.0',
    content: V1170,
  },
  {
    version: '1.15.0',
    date: '2023-04-01',
    tag: 'improved',
    title: 'Fresh Look',
    slug: 'v1.15.0',
    content: V1150,
  },
  {
    version: '1.14.0',
    date: '2023-03-31',
    tag: 'improved',
    title: 'Simplified Sign-In',
    slug: 'v1.14.0',
    content: V1140,
  },
  {
    version: '1.12.0',
    date: '2022-11-13',
    tag: 'new',
    title: 'Never Locked Out',
    slug: 'v1.12.0',
    content: V1120,
  },
  {
    version: '1.10.0',
    date: '2022-07-09',
    tag: 'new',
    title: 'Celebrate Results',
    slug: 'v1.10.0',
    content: V1100,
  },
  {
    version: '1.8.0',
    date: '2022-06-15',
    tag: 'new',
    title: 'New Disguises',
    slug: 'v1.8.0',
    content: V180,
  },
  {
    version: '1.6.0',
    date: '2022-04-17',
    tag: 'new',
    title: 'Task Queue',
    slug: 'v1.6.0',
    content: V160,
  },
  {
    version: '1.5.0',
    date: '2021-08-21',
    tag: 'new',
    title: 'Dark Mode',
    slug: 'v1.5.0',
    content: V150,
  },
  {
    version: '1.3.0',
    date: '2021-03-21',
    tag: 'improved',
    title: 'Universal Emoji',
    slug: 'v1.3.0',
    content: V130,
  },
  {
    version: '1.2.0',
    date: '2021-03-07',
    tag: 'new',
    title: 'Hidden Votes',
    slug: 'v1.2.0',
    content: V120,
  },
  {
    version: '1.1.0',
    date: '2021-03-06',
    tag: 'improved',
    title: 'Personal Touch',
    slug: 'v1.1.0',
    content: V110,
  },
  {
    version: '1.0.0',
    date: '2021-02-27',
    tag: 'new',
    title: 'spoker is Here',
    slug: 'v1.0.0',
    content: V100,
  },
];
