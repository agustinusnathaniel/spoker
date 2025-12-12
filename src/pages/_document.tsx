import { ColorModeScript } from '@chakra-ui/react';
import type { DocumentContext } from 'next/document';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import {
  UMAMI_DATA_DOMAIN,
  UMAMI_SRC,
  UMAMI_WEBSITE_ID,
} from '~/lib/constants/umami';
import { customTheme } from '~/lib/styles/theme';

const APP_NAME = 'spoker';
const APP_DESCRIPTION = 'Scrum Poker';

class MyDocument extends Document {
  static getInitialProps(ctx: DocumentContext) {
    return Document.getInitialProps(ctx);
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="description" content={APP_DESCRIPTION} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />

          {/* add your own app-icon */}
          {/* <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link rel="shortcut icon" href="/app-icon.png" /> */}
          <link rel="manifest" href="/manifest.json" />

          {/* umami self-hosted analytics */}

          {UMAMI_SRC && UMAMI_WEBSITE_ID && (
            <script
              async
              defer
              data-website-id={UMAMI_WEBSITE_ID}
              src={UMAMI_SRC}
              data-domains={UMAMI_DATA_DOMAIN}
            />
          )}
        </Head>
        <body>
          <ColorModeScript
            initialColorMode={customTheme.config?.initialColorMode}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
