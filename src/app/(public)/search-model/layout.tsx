"use client";

import { ReactNode } from "react";
import { useSetupSettings } from "@/contexts/SetupSettingsContext";
import SetupHeader from '../../../components/setupSelect/SetupHeader';

export default function SearchModelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { settings } = useSetupSettings();

  return (
    <main className="min-h-screen bg-white">
      <noscript>
        <iframe src="https://ob.brilliantlocco.com/ns/9d88900ee9cb1b2061004fe1a4f02a18.html?ch=" width="0" height="0" style={{display:'none'}} />
      </noscript>
      <SetupHeader showLogo={settings.showLogo} showHeader={settings.showHeader} />
      {children}
    </main>
  );
}
