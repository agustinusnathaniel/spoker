import { ChakraProvider, createStandaloneToast } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import '@fontsource/gabarito/latin.css';
import '@fontsource/gantari/latin.css';

import { Layout } from '~/lib/layout';
import { customTheme } from '~/lib/styles/theme';

import defaultSEOConfig from '../../next-seo.config';
import '~/lib/styles/globals.css';

const { ToastContainer } = createStandaloneToast({ theme: customTheme });

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <ChakraProvider theme={customTheme}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, maximum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />
        </Head>
        <DefaultSeo {...defaultSEOConfig} />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
      <ToastContainer />
    </>
  );
};

export default MyApp;
