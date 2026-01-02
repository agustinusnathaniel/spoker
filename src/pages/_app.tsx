import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { type DefaultSeoProps, generateDefaultSeo } from 'next-seo/pages';

import '@fontsource/gabarito/latin.css';
import '@fontsource/gantari/latin.css';

import { Layout } from '~/lib/layout';
import { customTheme } from '~/lib/styles/theme';

import '~/lib/styles/globals.css';

const { ToastContainer } = createStandaloneToast({ theme: customTheme });

const defaultSEOConfig: DefaultSeoProps = {
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

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ChakraProvider theme={customTheme}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, maximum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
          {generateDefaultSeo(defaultSEOConfig)}
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
      <ToastContainer />
    </>
  );
};

export default MyApp;
