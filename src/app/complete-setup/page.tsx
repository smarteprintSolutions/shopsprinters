import CompleteSetupPage from '@/components/setupSelect/CompleteSetupPage';

export const metadata = {
  title: 'Complete Printer Setup | HP Smart App Guidance',
  description:
    'Complete your HP printer setup with the HP Smart App. Follow guided instructions for driver installation, printer connection, and setup verification.',
  canonical: 'https://shopsprinters.com/complete-setup/',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <CompleteSetupPage />;
}
