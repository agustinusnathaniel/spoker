import { FaGithub } from 'react-icons/fa';

type SponsorLink = {
  label: string;
  description?: string;
  url: string;
  icon?: React.ReactElement;
  colorScheme?: string;
};

export const sponsorLinks: Array<SponsorLink> = [
  {
    label: 'Github Sponsor',
    url: 'https://github.com/sponsors/agustinusnathaniel',
    icon: <FaGithub />,
  },
  {
    label: '🇮🇩 NBJ (Nih buat jajan)',
    description: '(QRIS, GoPay, etc)',
    url: 'https://www.nihbuatjajan.com/sozonome',
    colorScheme: 'orange',
  },
  {
    label: 'Ko-fi',
    url: 'https://ko-fi.com/sozonome',
    colorScheme: 'blue',
  },
  {
    label: 'Buy Me a Coffee',
    url: 'https://www.buymeacoffee.com/sozonome',
    colorScheme: 'yellow',
  },
];
