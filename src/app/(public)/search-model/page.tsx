import ModelSearch from '@/components/setupSelect/ModelSearch';

export const metadata = {
  title: 'Printer Model Search | HP Setup Flow',
  description:
    'Search for your HP printer model and continue the guided setup flow for printer setup, drivers, and support.',
  canonical: 'https://shopsprinters.com/search-model/',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ModelSearch hideHeader />;
}
