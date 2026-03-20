import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { Provider } from '~/lib/components/ui/provider';
import { Toaster } from '~/lib/components/ui/toaster';
import { Layout } from '~/lib/layout';

import '@fontsource/gabarito/latin.css';
import '@fontsource/gantari/latin.css';
import '~/lib/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'spoker',
    template: '%s | spoker - real-time multiplayer scrum poker with teams',
  },
  description: 'Real-time multiplayer scrum poker with teams',
  metadataBase: new URL('https://spoker.sznm.dev'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://spoker.sznm.dev',
    title: 'spoker',
    description: 'Real-time multiplayer scrum poker with teams',
    images: [
      {
        url: 'https://og.sznm.dev/api/generate?heading=Spoker&text=Scrum%20Poker%20with%20teams',
        alt: 'spoker og-image',
      },
    ],
    siteName: 'spoker',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@agstnsnathaniel',
    creator: '@agstnsnathaniel',
  },
  icons: {
    icon: '/chip.svg',
    apple: '/chip.svg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'spoker',
    statusBarStyle: 'default',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'format-detection': 'telephone=no',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
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
          process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
            <Script
              async
              data-domains={process.env.NEXT_PUBLIC_UMAMI_DATA_DOMAIN}
              data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
              defer
              src={process.env.NEXT_PUBLIC_UMAMI_SRC}
            />
          )}
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
