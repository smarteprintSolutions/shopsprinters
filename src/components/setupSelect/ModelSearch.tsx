"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSetupSettings } from '@/contexts/SetupSettingsContext';
import SetupHeader from './SetupHeader';

const ModelSearch = ({ allowModelSearch, hideHeader = false }: { allowModelSearch?: boolean; hideHeader?: boolean }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { settings } = useSetupSettings();
  const searchEnabled = allowModelSearch ?? settings.allowModelSearch;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEnabled) {
      setInput('');
      setError('');
      return;
    }
    if (input.trim() === '') {
      setError('Please enter your product name.');
      return;
    }
    // localStorage.setItem('modelSearchInput', input.trim());
    setError('');
    router.push('/complete-setup');
  };

  return (
    

    <div className="w-full min-h-screen bg-white flex flex-col">
      {!hideHeader && <SetupHeader showLogo={settings.showLogo} showHeader={settings.showHeader} />}

      <section
        className="relative overflow-hidden bg-[#024AD8]/50 w-full min-h-[420px] flex items-start justify-center md:px-[6%] px-2 sm:px-3"
        style={{ height: '420px' }}
      >
        <div className="absolute inset-0">
          <img
            src="/hero_background_image.webp"
            alt="Background"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div />

        <div className="w-full max-w-[1200px] flex md:flex-row flex-col items-start md:justify-between justify-start relative z-10 h-full">
          <div className="flex flex-col justify-center h-full w-full max-w-[700px] md:pt-0 pt-8" id="model-search-main-content">
            <h1 className="text-white text-2xl sm:text-3xl md:text-[2.7rem] font-normal mb-6 md:mb-8 leading-tight drop-shadow-lg">Set up your printer</h1>
            <p className="text-white text-base sm:text-lg md:text-xl mb-6 md:mb-8 font-normal leading-snug drop-shadow">
              Enter your product name and model number to get the right smart software and drivers for you
            </p>
            <form className="flex flex-col md:flex-row items-center w-full max-w-[600px] gap-3 md:gap-0" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Enter your product name here. For example: "OfficeJet 9010"'
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#024AD8] text-base sm:text-lg bg-white shadow-sm w-full min-w-0"
              />
              <button
                type="submit"
                className="md:ml-4 ml-0 bg-white text-[#024AD8] font-semibold px-8 py-3 rounded-full text-base sm:text-lg shadow hover:bg-[#024AD8] hover:text-white  transition w-full md:w-auto min-w-[120px]"
              >
                Search
              </button>
            </form>
            {error && <div className="text-red-500 text-sm mt-2 text-left">{error}</div>}
          </div>
          <div className="hidden md:flex items-end h-full absolute right-0 bottom-0 z-10">
            <img
              src="/printer-without-bg.png"
              alt="Printer and Devices"
              className="h-[120px] sm:h-[160px] md:h-[200px] w-auto max-w-none drop-shadow-xl"
              style={{ marginBottom: '-40px' }}
            />
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1200px] md:ml-[12%] ml-0 mt-8 md:mt-[12vh] md:px-[6%] px-2 sm:px-3 flex md:flex-row flex-col items-start justify-between relative">
        <div className="flex flex-col w-full max-w-[700px]">
          <p className="text-gray-700 text-base sm:text-[1.05rem] md:text-[1.15rem] mb-4 md:mb-6">
            Install smart software and drivers on each mobile device or computer that you want to print from. Add the printer on the new device.
          </p>
          <p className="text-gray-700 text-base sm:text-[1.05rem] md:text-[1.15rem]">
            Need additional help with set-up? Visit{' '}
            <a href="#" className="text-[#024AD8] underline hover:text-[#024AD8]/95" aria-label="HP support">
              support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ModelSearch;
