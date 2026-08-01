import SettingsManagement from '@/components/setupSelect/SettingsManagement';

export const metadata = {
  title: 'Printer Setup Settings | Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPrinterSettingsPage() {
  return (
    <div className="p-6">
      <SettingsManagement />
    </div>
  );
}
