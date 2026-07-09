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
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#024AD8" />
      </head>
      <body className="flex flex-col min-h-screen bg-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
