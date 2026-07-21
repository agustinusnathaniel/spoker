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
    content: V1170,
    date: '2026-03-22',
    slug: 'v1.17.0',
    tag: 'new',
    title: 'Modern Makeover',
    version: '1.17.0',
  },
  {
    content: V1150,
    date: '2023-04-01',
    slug: 'v1.15.0',
    tag: 'improved',
    title: 'Fresh Look',
    version: '1.15.0',
  },
  {
    content: V1140,
    date: '2023-03-31',
    slug: 'v1.14.0',
    tag: 'improved',
    title: 'Simplified Sign-In',
    version: '1.14.0',
  },
  {
    content: V1120,
    date: '2022-11-13',
    slug: 'v1.12.0',
    tag: 'new',
    title: 'Never Locked Out',
    version: '1.12.0',
  },
  {
    content: V1100,
    date: '2022-07-09',
    slug: 'v1.10.0',
    tag: 'new',
    title: 'Celebrate Results',
    version: '1.10.0',
  },
  {
    content: V180,
    date: '2022-06-15',
    slug: 'v1.8.0',
    tag: 'new',
    title: 'New Disguises',
    version: '1.8.0',
  },
  {
    content: V160,
    date: '2022-04-17',
    slug: 'v1.6.0',
    tag: 'new',
    title: 'Task Queue',
    version: '1.6.0',
  },
  {
    content: V150,
    date: '2021-08-21',
    slug: 'v1.5.0',
    tag: 'new',
    title: 'Dark Mode',
    version: '1.5.0',
  },
  {
    content: V130,
    date: '2021-03-21',
    slug: 'v1.3.0',
    tag: 'improved',
    title: 'Universal Emoji',
    version: '1.3.0',
  },
  {
    content: V120,
    date: '2021-03-07',
    slug: 'v1.2.0',
    tag: 'new',
    title: 'Hidden Votes',
    version: '1.2.0',
  },
  {
    content: V110,
    date: '2021-03-06',
    slug: 'v1.1.0',
    tag: 'improved',
    title: 'Personal Touch',
    version: '1.1.0',
  },
  {
    content: V100,
    date: '2021-02-27',
    slug: 'v1.0.0',
    tag: 'new',
    title: 'spoker is Here',
    version: '1.0.0',
  },
];
