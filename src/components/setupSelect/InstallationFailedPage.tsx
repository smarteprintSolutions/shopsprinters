"use client";
import React, { useEffect } from 'react';
import { useSetupSettings } from '@/contexts/SetupSettingsContext';
import SetupHeader from './SetupHeader';

export default function InstallationFailedPage() {
  const { settings, loading } = useSetupSettings();

  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && !settings.allowInstallationFailed) {
      window.location.href = '/easy-setup-guide/';
    }
  }, [loading, settings.allowInstallationFailed]);

  if (loading || !settings.allowInstallationFailed) return null;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <SetupHeader showLogo={settings.showLogo} showHeader={settings.showHeader} />
      <div
        className="flex-1 flex items-center justify-center bg-cover bg-center px-4 py-12 relative"
        style={{ backgroundImage: "url('/hero_background_image.webp')" }}
      >
        <div className="absolute inset-0 mix-blend-multiply"></div>

        <div className="w-full max-w-3xl rounded-3xl bg-white p-8 md:p-10 shadow-2xl relative z-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-yellow-400 shadow-lg">
            <span className="text-3xl font-bold text-white">!</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-950 mb-3 text-center">Printer Driver Installation Error</h1>
          <p className="text-red-600 font-semibold text-sm md:text-base mb-5 leading-relaxed text-center">
            We encountered an issue completing the printer driver installation due to error 1603.
          </p>
          <div className="text-slate-950 font-semibold text-lg md:text-xl mb-2 text-center">Contact HP Support to Resolve this Issue</div>
          <div className="text-slate-700 text-sm md:text-base mb-7 text-center">
            Toll-Free (USA/CA): <span className="font-bold">+1 (877) 238-0240</span>
          </div>
          <div className="flex justify-center mb-6">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-[#024AD8] px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#024AD8]/95"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).jivo_api?.open) {
                  (window as any).jivo_api.open();
                } else {
                  alert('Chat support is not available yet.');
                }
              }}
            >
              Chat Now »
            </button>
          </div>

          <p className="text-red-600 text-xs md:text-sm leading-relaxed text-center">
            Note: For best results, avoid repeatedly attempting the installation without proper guidance, as it may not resolve the issue. Our experts are here to help you complete the setup correctly.
          </p>
        </div>
      </div>
    </div>
  );
}
