/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  title: 'vote!',
  titleTemplate: '%s | spoker - real-time multiplayer scrum poker with teams',
  defaultTitle: 'spoker',
  description: 'Real-time multiplayer scrum poker with teams',
  canonical: 'https://spoker.dev',
  openGraph: {
    url: 'https://spoker.dev',
    title: 'spoker',
    description: 'Real-time multiplayer scrum poker with teams',
    images: [
      {
        url: 'https://og.sznm.dev/api/generate?heading=Spoker&text=Scrum%20Poker%20with%20teams',
        alt: 'spoker.dev og-image',
      },
    ],
    site_name: 'spoker',
  },
  twitter: {
    handle: '@agstnsnathaniel',
    cardType: 'summary_large_image',
  },
};

export default defaultSEOConfig;
