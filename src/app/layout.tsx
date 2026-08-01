import type { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'ShopsPrinters - Quality Printer Supplies & Setup Support',
  description:
    'Get professional printer supplies and expert setup guidance. Find quality products and comprehensive printer support.',
  keywords:
    'printers, printer supplies, printer setup, ink, toner, printer support',
  authors: [{ name: 'ShopsPrinters' }],
  creator: 'ShopsPrinters',
  publisher: 'ShopsPrinters',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://shopsprinters.com',
    siteName: 'ShopsPrinters',
    title: 'ShopsPrinters - Quality Printer Supplies & Setup Support',
    description: 'Professional printer supplies and expert setup guidance.',
    images: [
      {
        url: 'https://shopsprinters.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShopsPrinters',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopsPrinters',
    description: 'Professional printer supplies and expert setup guidance.',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#024AD8" />
        <script
          async
          src="https://ob.brilliantlocco.com/i/9d88900ee9cb1b2061004fe1a4f02a18.js"
          className="ct_clicktrue"
        />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17904808678"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-17904808678');`,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-white antialiased">
        <noscript>
          <iframe
            src="https://ob.brilliantlocco.com/ns/9d88900ee9cb1b2061004fe1a4f02a18.html?ch="
            width="0"
            height="0"
            style={{ display: 'none' }}
          />
        </noscript>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
