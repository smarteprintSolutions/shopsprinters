import InstallationFailedPage from '@/components/setupSelect/InstallationFailedPage';

export const metadata = {
  title: 'Printer Installation Failed | Troubleshooting Guide',
  description:
    'Troubleshoot HP printer installation failures and get help resolving driver or connection errors. This page is part of the setup flow and is not indexed by search engines.',
  canonical: 'https://shopsprinters.com/installation-failed/',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <InstallationFailedPage />;
}
