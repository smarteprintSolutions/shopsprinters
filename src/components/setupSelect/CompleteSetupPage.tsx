"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetupSettings } from '@/contexts/SetupSettingsContext';
import SetupHeader from './SetupHeader';
import SetupProgressModal from './SetupProgressModal1';

export default function CompleteSetupPage() {
  const router = useRouter();
  const { settings, loading } = useSetupSettings();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !settings.allowCompleteSetup) {
      router.replace('/easy-setup-guide/');
    }
  }, [loading, settings.allowCompleteSetup, router]);

  if (loading || !settings.allowCompleteSetup) return null;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col">
      <SetupHeader showLogo={settings.showLogo} showHeader={settings.showHeader} />
      <section className="relative overflow-hidden w-full min-h-[560px] flex items-start justify-center px-[6%]" style={{ height: '560px' }}>
        <div className="absolute inset-0">
          <img
            src="/hero_background_image.webp"
            alt="Background"
            className="w-full h-full object-cover object-center"
          />
        </div>
                {/* <div className="absolute opacity-40 inset-0 bg-[#024AD8] mix-blend-multiply"></div> */}

        <div />

        <div className="w-full max-w-[1200px] flex flex-col md:flex-row items-start justify-between relative z-10 h-full">
          <div className="flex flex-col justify-center h-full w-full max-w-[700px] pt-8">
            <h1 className="text-white text-3xl md:text-[2.6rem] font-bold mb-8 leading-tight drop-shadow-lg">Complete setup using <br /> HP Smart App</h1>
            <p className="text-white text-lg md:text-xl mb-6 font-normal drop-shadow whitespace-normal">
              HP Smart App will connect the printer to your computer, install print drivers, and set up scanning features (if applicable).
            </p>
            <ol className="text-white text-lg mb-6 pl-6 list-decimal font-medium">
              <li className="mb-1">Make sure your printer is powered on</li>
              <li>Install HP Smart App to complete setup</li>
            </ol>
            <button
              type="button"
              className="bg-white text-blue-700 font-bold px-8 py-3.5 rounded-full text-lg shadow-xl hover:bg-blue-50 transition-all mb-6 w-fit transform hover:scale-105"
              onClick={() => setShowModal(true)}
            >
              Install HP Smart App
            </button>
            <div className="text-white text-sm md:text-base mb-4 font-medium">
              <span className="font-bold">To use all available printer features</span>, you must install the HP Smart app on a mobile device or the latest version of Windows or macOS. Available on:
            </div>
            <div className="flex flex-row gap-4 mb-2">
              <img src="/app-store.svg" alt="App Store" className="h-10 hover:opacity-80 transition cursor-pointer" />
              <img src="/Google_Play.svg" alt="Google Play" className="h-10 hover:opacity-80 transition cursor-pointer" />
              <img src="/microsoft.svg" alt="Microsoft Store" className="h-10 object-contain hover:opacity-80 transition cursor-pointer" />
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center h-full absolute right-0 bottom-0 z-10">
            <div className="relative flex flex-col items-center">
              <img
                src="/hp-printer-software.png"
                alt="HP Printer Software"
                className="h-[180px] w-auto max-w-none drop-shadow-2xl"
                style={{ marginTop: '220px' }}
              />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-2 text-white text-xs font-bold drop-shadow bg-black/40 px-3 py-1 rounded-full whitespace-nowrap">
                HP Printer Software
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1200px] mx-auto mt-16 px-4 md:px-0">
        <div className="flex flex-col w-full max-w-[900px]">
          <div className="flex md:flex-row flex-col md:items-center items-start mb-3 gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">?</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Set up scanning from a control panel (if applicable):</h2>
          </div>
          <div className="text-gray-600 md:ml-12 ml-0 text-base leading-relaxed">
            Set up additional scanning features (Windows only). Get started by selecting <span className="font-bold text-blue-600">Install HP Smart App</span> above.
            <span className="text-gray-500 italic block mt-2">Note: To scan from a macOS computer, install the HP Smart app.</span>
          </div>
          <div className="border-b border-gray-100 my-8"></div>
          <div className="space-y-6 md:ml-12 ml-0">
            <div className="flex items-center gap-4 group">
              <span className="text-blue-500 text-2xl">?</span>
              <span className="text-gray-700 text-base md:text-lg">Need help troubleshooting during printer setup? <span className="text-blue-600 font-bold ml-1">Solve Setup Issues</span></span>
            </div>
            <div className="flex items-center gap-4 group">
              <span className="text-blue-500 text-2xl">i</span>
              <span className="text-gray-700 text-base md:text-lg">Find additional setup information and videos <span className="text-blue-600 font-bold ml-1">Visit HP Support</span></span>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <SetupProgressModal open={showModal} onClose={() => setShowModal(false)} onError={() => router.push('/installation-failed')} />
        </div>
      )}
    </div>
  );
}
