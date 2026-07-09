import SettingsManagementWrapper from '@/components/setupSelect/SettingsManagementWrapper';

export const metadata = {
  title: 'Setup Flow Settings | Private Admin',
  description:
    'Manage printer setup flow configuration and feature toggles. This admin settings page is not indexed by search engines.',
  canonical: 'https://shopsprinters.com/settings-management/',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Client wrapper fetches settings and renders the interactive UI */}
        <SettingsManagementWrapper />
      </div>
    </div>
  );
}
