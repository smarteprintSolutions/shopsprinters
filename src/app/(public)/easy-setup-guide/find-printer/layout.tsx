import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Printer Model | Quick Driver Download',
  description: 'Search your printer model and download the correct drivers quickly with our guided setup flow.',
  alternates: {
    canonical: 'https://shopsprinters.com/easy-setup-guide/find-printer/',
  },
  openGraph: {
    title: 'Find Printer Model | Quick Driver Download',
    description: 'Search your printer model and download the correct drivers quickly with our guided setup flow.',
    url: 'https://shopsprinters.com/easy-setup-guide/find-printer/',
    siteName: 'ShopsPrinters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Printer Model | Quick Driver Download',
    description: 'Search your printer model and download the correct drivers quickly with our guided setup flow.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FindPrinterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
