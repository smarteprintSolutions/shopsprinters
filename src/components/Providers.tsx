'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { SetupSettingsProvider } from '@/contexts/SetupSettingsContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SetupSettingsProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </SetupSettingsProvider>
    </AuthProvider>
  );
}
