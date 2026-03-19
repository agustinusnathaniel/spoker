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
          <meta content={APP_NAME} name="application-name" />
          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta
            content="default"
            name="apple-mobile-web-app-status-bar-style"
          />
          <meta content={APP_NAME} name="apple-mobile-web-app-title" />
          <meta content={APP_DESCRIPTION} name="description" />
          <meta content="telephone=no" name="format-detection" />
          <meta content="yes" name="mobile-web-app-capable" />
          <meta content="#FFFFFF" name="theme-color" />

          {/* add your own app-icon */}
          {/* <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icons/apple-touch-icon.png"
          />
          <link rel="shortcut icon" href="/app-icon.png" /> */}
          <link href="/manifest.json" rel="manifest" />

          {/* umami self-hosted analytics */}

          {UMAMI_SRC && UMAMI_WEBSITE_ID && (
            <script
              async
              data-domains={UMAMI_DATA_DOMAIN}
              data-website-id={UMAMI_WEBSITE_ID}
              defer
              src={UMAMI_SRC}
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
