import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { Provider } from '~/lib/components/ui/provider';
import { Toaster } from '~/lib/components/ui/toaster';
import { Layout } from '~/lib/layout';

import '@fontsource/gabarito/latin.css';
import '@fontsource/gantari/latin.css';
import '~/lib/styles/globals.css';

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'spoker',
  },
  description: 'Real-time multiplayer scrum poker with teams',
  icons: {
    apple: '/chip.svg',
    icon: '/chip.svg',
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://spoker.sznm.dev'),
  openGraph: {
    description: 'Real-time multiplayer scrum poker with teams',
    images: [
      {
        alt: 'spoker og-image',
        url: 'https://og.sznm.dev/api/generate?heading=Spoker&text=Scrum%20Poker%20with%20teams',
      },
    ],
    locale: 'en_US',
    siteName: 'spoker',
    title: 'spoker',
    type: 'website',
    url: 'https://spoker.sznm.dev',
  },
  other: {
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
  },
  title: {
    default: 'spoker',
    template: '%s | spoker - real-time multiplayer scrum poker with teams',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@agstnsnathaniel',
    site: '@agstnsnathaniel',
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: '#FFFFFF',
  viewportFit: 'cover',
  width: 'device-width',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Umami self-hosted analytics */}
        {process.env.NEXT_PUBLIC_UMAMI_SRC &&
        process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? (
          <Script
            async
            data-domains={process.env.NEXT_PUBLIC_UMAMI_DATA_DOMAIN}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_SRC}
          />
        ) : null}
      </head>
      <body>
        <Provider defaultTheme="system" enableSystem>
          <Layout>{children}</Layout>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
