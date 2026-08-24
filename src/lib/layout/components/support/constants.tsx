import { FaGithub } from 'react-icons/fa';

interface SponsorLink {
  colorScheme?: string;
  description?: string;
  icon?: React.ReactElement;
  label: string;
  url: string;
}

export const sponsorLinks: Array<SponsorLink> = [
  {
    icon: <FaGithub />,
    label: 'Github Sponsor',
    url: 'https://github.com/sponsors/agustinusnathaniel',
  },
  {
    colorScheme: 'orange',
    description: '(QRIS, GoPay, etc)',
    label: '🇮🇩 NBJ (Nih buat jajan)',
    url: 'https://www.nihbuatjajan.com/sozonome',
  },
  {
    colorScheme: 'blue',
    label: 'Ko-fi',
    url: 'https://ko-fi.com/sozonome',
  },
  {
    colorScheme: 'yellow',
    label: 'Buy Me a Coffee',
    url: 'https://www.buymeacoffee.com/sozonome',
  },
];
