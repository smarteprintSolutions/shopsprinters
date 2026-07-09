import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import JivoChatButton from '@/components/setupSelect/JivoChatButton';

export const metadata = {
  title: 'HP Printer Setup Guide | Easy Printer Setup & Troubleshooting',
  description:
    'Follow the HP printer setup guide for fast installation, WiFi troubleshooting, driver support, and printer setup help. Expert printer setup guidance and easy fixes in one place.',
  canonical: 'https://shopsprinters.com/easy-setup-guide/',
  openGraph: {
    title: 'HP Printer Setup Guide | Easy Printer Setup & Troubleshooting',
    description:
      'Follow the HP printer setup guide for fast installation, WiFi troubleshooting, driver support, and printer setup help.',
    url: 'https://shopsprinters.com/easy-setup-guide/',
    siteName: 'ShopsPrinters',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HP Printer Setup Guide | Easy Printer Setup & Troubleshooting',
    description:
      'Follow the HP printer setup guide for fast installation, WiFi troubleshooting, driver support, and printer setup help.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EasySetupGuide() {
  return (
    <main className="min-h-screen bg-white">
      {/* ================= HERO SECTION - BLUE BG WITH IMAGE ================= */}
      <section className="relative overflow-hidden">
        {/* Background Image with blue tint */}
        <div className="absolute inset-0">
          <Image
            src="/hero-dark-setup.png"
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div/>

        <div className="max-w-7xl mx-auto text-center relative z-10 px-6 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 text-white leading-tight tracking-tight">
            Smart Printer Setup & Troubleshooting
          </h1>
          <p className="text-sm md:text-base mb-6 text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
            Setup, offline errors, WiFi drops, driver issues — guided solutions that get you printing again in minutes.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Link 
              href="/search-model/" 
              className="inline-flex items-center gap-2 bg-[#28a745] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#218838] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"/>
              </svg>
              QUICK SETUP
            </Link>
            <Link 
              href="/search-model/" 
              className="inline-flex items-center gap-2 bg-[#28a745] text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-[#218838] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              EASY TROUBLESHOOTING
            </Link>
          </div>
        </div>
      </section>

      {/* Choose Your Issue Section */}
      <section className="py-5 md:py-10 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-dark">Choose Your Issue</h2>
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">Select an option below for smart printer setup and troubleshooting.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Link href="/search-model" className="group relative bg-white border border-[#024AD8]/30 rounded-2xl p-6 md:p-7 hover:border-[#024AD8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#024AD8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 group-hover:from-[#024AD8] group-hover:to-[#023a9b] transition-all duration-300 shadow-md group-hover:shadow-lg">
                  <svg className="w-7 h-7 text-[#024AD8] group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[#024AD8] group-hover:text-[#023a9b] transition-colors">New Printer Setup</h3>
                <p className="text-gray-600 mb-5 text-sm md:text-base leading-relaxed">New printer in the box? Go from unboxed to first print without the hassle.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#024AD8] text-white rounded-full font-semibold text-sm hover:bg-[#023a9b] group-hover:shadow-lg transition-all duration-300">
                  <span>Start Setup</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/search-model" className="group relative bg-white border border-[#024AD8]/30 rounded-2xl p-6 md:p-7 hover:border-[#024AD8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#024AD8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 group-hover:from-[#024AD8] group-hover:to-[#023a9b] transition-all duration-300 shadow-md group-hover:shadow-lg">
                  <svg className="w-7 h-7 text-[#024AD8] group-hover:text-white group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[#024AD8] group-hover:text-[#023a9b] transition-colors">Printer Shows Offline</h3>
                <p className="text-gray-600 mb-5 text-sm md:text-base leading-relaxed">Printer showing offline again? Get it back online in minutes — for good.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#024AD8] text-white rounded-full font-semibold text-sm hover:bg-[#023a9b] group-hover:shadow-lg transition-all duration-300">
                  <span>Fix Offline</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/search-model" className="group relative bg-white border border-[#024AD8]/30 rounded-2xl p-6 md:p-7 hover:border-[#024AD8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#024AD8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 group-hover:from-[#024AD8] group-hover:to-[#023a9b] transition-all duration-300 shadow-md group-hover:shadow-lg">
                  <svg className="w-7 h-7 text-[#024AD8] group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[#024AD8] group-hover:text-[#023a9b] transition-colors">Install Printer Drivers</h3>
                <p className="text-gray-600 mb-5 text-sm md:text-base leading-relaxed">Wrong or outdated drivers? Get the exact match for your model installed.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#024AD8] text-white rounded-full font-semibold text-sm hover:bg-[#023a9b] group-hover:shadow-lg transition-all duration-300">
                  <span>Install Drivers</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/search-model" className="group relative bg-white border border-[#024AD8]/30 rounded-2xl p-6 md:p-7 hover:border-[#024AD8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#024AD8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 group-hover:from-[#024AD8] group-hover:to-[#023a9b] transition-all duration-300 shadow-md group-hover:shadow-lg">
                  <svg className="w-7 h-7 text-[#024AD8] group-hover:text-white group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[#024AD8] group-hover:text-[#023a9b] transition-colors">WiFi Connection Drops</h3>
                <p className="text-gray-600 mb-5 text-sm md:text-base leading-relaxed">Tired of your printer vanishing from WiFi? Lock in a connection that lasts.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#024AD8] text-white rounded-full font-semibold text-sm hover:bg-[#023a9b] group-hover:shadow-lg transition-all duration-300">
                  <span>Fix WiFi</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/search-model" className="group relative bg-white border border-[#024AD8]/30 rounded-2xl p-6 md:p-7 hover:border-[#024AD8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#024AD8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 group-hover:from-[#024AD8] group-hover:to-[#023a9b] transition-all duration-300 shadow-md group-hover:shadow-lg">
                  <svg className="w-7 h-7 text-[#024AD8] group-hover:text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[#024AD8] group-hover:text-[#023a9b] transition-colors">Error Codes / Not Detected</h3>
                <p className="text-gray-600 mb-5 text-sm md:text-base leading-relaxed">Flashing lights or cryptic errors? Get a real diagnosis, not guesswork.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#024AD8] text-white rounded-full font-semibold text-sm hover:bg-[#023a9b] group-hover:shadow-lg transition-all duration-300">
                  <span>Diagnose</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/search-model" className="group relative bg-white border border-[#024AD8]/30 rounded-2xl p-6 md:p-7 hover:border-[#024AD8] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#024AD8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl mb-4 group-hover:from-[#024AD8] group-hover:to-[#023a9b] transition-all duration-300 shadow-md group-hover:shadow-lg">
                  <svg className="w-7 h-7 text-[#024AD8] group-hover:text-white group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold mb-2 text-[#024AD8] group-hover:text-[#023a9b] transition-colors">Scanner Not Working?</h3>
                <p className="text-gray-600 mb-5 text-sm md:text-base leading-relaxed">Blank scans or streaky pages? Bring back crisp, clean prints today.</p>
                <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#024AD8] text-white rounded-full font-semibold text-sm hover:bg-[#023a9b] group-hover:shadow-lg transition-all duration-300">
                  <span>Fix Scanner</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-12 p-5 bg-gradient-to-r from-[#024AD8] to-[#023a9b] rounded-lg text-center text-white shadow-lg">
            <p className="text-base mb-3">Need more help? Connect with our live chat support team for quick assistance.</p>
            <JivoChatButton className="inline-flex bg-white text-[#024AD8] px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#024AD8]/10 transition-colors">
              Start Live Chat
            </JivoChatButton>
          </div>
        </div>
      </section>

      {/* 123.Hp.Com/setup Guide Section */}
      <section className="py-10 md:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-dark">
              123.Hp.Com/setup Guide – HP Printer Setup & Offline Fix
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Set up your HP printer the easy way using the 123.hp.com/setup process. This step-by-step guide walks you through installing your new HP printer, connecting it to Wi-Fi, fixing the dreaded HP printer offline error, and troubleshooting common problems — with clear instructions for both Windows and Mac.
            </p>
          </div>

          {/* Steps with Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="border border-[#024AD8]/60 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group shadow-md">
              <div className="relative h-40 md:h-44 bg-gray-100 overflow-hidden">
                <Image src="/banner-1.jpg" alt="Download HP Software" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-5 md:p-6 bg-white">
                <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold mb-3 text-sm">1</div>
                <h3 className="text-sm md:text-base font-bold mb-2 text-[#024AD8]">Download HP Software</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Get the latest HP drivers and software from 123.hp.com/setup, matched to your exact model.</p>
              </div>
            </div>

            <div className="border border-[#024AD8]/60 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group shadow-md">
              <div className="relative h-40 md:h-44 bg-gray-100 overflow-hidden">
                <Image src="/banner-2.jpg" alt="Connect Your Printer" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-5 md:p-6 bg-white">
                <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold mb-3 text-sm">2</div>
                <h3 className="text-sm md:text-base font-bold mb-2 text-[#024AD8]">Connect Your Printer</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Link your HP printer over Wi-Fi or USB using the printer's built-in setup screen.</p>
              </div>
            </div>

            <div className="border border-[#024AD8]/60 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group shadow-md">
              <div className="relative h-40 md:h-44 bg-gray-100 overflow-hidden">
                <Image src="/banner-3.jpg" alt="Install the Printer Drivers" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-5 md:p-6 bg-white">
                <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold mb-3 text-sm">3</div>
                <h3 className="text-sm md:text-base font-bold mb-2 text-[#024AD8]">Install the Printer Drivers</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Follow the on-screen HP Smart prompts to finish installation and add your device.</p>
              </div>
            </div>

            <div className="border border-[#024AD8]/60 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group shadow-md">
              <div className="relative h-40 md:h-44 bg-gray-100 overflow-hidden">
                <Image src="/banner-4.jpg" alt="Test the Printer" fill className="object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-5 md:p-6 bg-white">
                <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold mb-3 text-sm">4</div>
                <h3 className="text-sm md:text-base font-bold mb-2 text-[#024AD8]">Test the Printer</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">Print a test page to confirm your HP printer is online and working correctly.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Windows Setup Section */}
      <section className="py-10 md:py-14 px-4 bg-gradient-to-b from-gray-50 to-white\">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8\">
            <div className="w-14 h-14 bg-[#024AD8] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg\">
              🖥️
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-dark\">
              HP Printer Setup for Windows (10 & 11)
            </h2>
          </div>

          <div className="space-y-12">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <h3 className="text-lg font-bold text-dark">Step 1: Physical Setup</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-[#024AD8] font-bold mt-1">•</span>
                  <span><strong>Power & Ink:</strong> Plug the HP printer into a power outlet, switch it on, and install the ink cartridges or toner.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#024AD8] font-bold mt-1">•</span>
                  <span><strong>Paper:</strong> Load the paper tray and slide the guides snug against the paper.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#024AD8] font-bold mt-1">•</span>
                  <span><strong>Wireless:</strong> On the printer's screen, open "Network Settings" or "Wi-Fi Setup" and join your home network.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#024AD8] font-bold mt-1">•</span>
                  <span><strong>USB:</strong> Prefer a cable? Connect the USB cable from the printer to your PC.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <h3 className="text-lg font-bold text-dark">Step 2: Add the Printer & Install Drivers</h3>
              </div>
              <ol className="space-y-3 text-gray-700 list-decimal list-inside">
                <li>Open a browser and go to 123.hp.com/setup, then download the HP Smart app.</li>
                <li>Run HP Smart and let it detect your printer automatically.</li>
                <li>Or open Settings &gt; Bluetooth &amp; devices &gt; Printers &amp; scanners and click Add device.</li>
                <li>Select your HP printer when it appears — Windows fetches the basic drivers for you.</li>
              </ol>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#ff2d46] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <h3 className="text-lg font-bold text-dark">Step 3: Fix "HP Printer Offline" on Windows</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-[#ff2d46] font-bold mt-1">•</span>
                  <span><strong>Set as default:</strong> In Printers & scanners, open your HP printer and uncheck "Use Printer Offline."</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff2d46] font-bold mt-1">•</span>
                  <span><strong>Restart the spooler:</strong> Press Win + R, type services.msc, find Print Spooler, right-click and choose Restart.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff2d46] font-bold mt-1">•</span>
                  <span><strong>Update the driver:</strong> In Device Manager, find your printer under "Print queues," right-click and select Update driver.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#ff2d46] font-bold mt-1">•</span>
                  <span><strong>Firewall check:</strong> Temporarily disable Windows Defender Firewall to see if your HP printer is detected.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mac Setup Section */}
      <section className="py-10 md:py-14 px-4 bg-white\">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8\">
            <div className="w-14 h-14 bg-[#024AD8] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg\">
              🖥️
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-dark\">
              HP Printer Setup for Mac (macOS)
            </h2>
          </div>

          <div className="space-y-12">
            <div className="relative">
              <div className="bg-[#fff5f6] p-6 md:p-8 rounded-xl border border-gray-200 overflow-hidden">
                <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-[#024AD8] rounded-r-lg shadow-[6px_0_18px_rgba(2,74,216,0.12)]"></div>
                <div className="relative ml-4 md:ml-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                    <h3 className="text-lg font-bold text-dark">Step 1: Physical Setup</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#024AD8] font-bold mt-1">•</span>
                      <span><strong>Hardware:</strong> Power on the HP printer and remove all protective orange shipping tape from inside.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#024AD8] font-bold mt-1">•</span>
                      <span><strong>Network:</strong> Put your Mac and HP printer on the same Wi-Fi network. With a cable, modern MacBooks may need a USB-C to USB-A adapter.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#fff5f6] p-6 md:p-8 rounded-xl border border-gray-200 overflow-hidden">
                <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-[#024AD8] rounded-r-lg shadow-[6px_0_18px_rgba(2,74,216,0.12)]"></div>
                <div className="relative ml-4 md:ml-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#024AD8] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                    <h3 className="text-lg font-bold text-dark">Step 2: Add the Printer</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#024AD8] font-bold mt-1">•</span>
                      <span>Open the Apple Menu and choose System Settings (or System Preferences).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#024AD8] font-bold mt-1">•</span>
                      <span>Scroll to Printers & Scanners.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#024AD8] font-bold mt-1">•</span>
                      <span>Click Add Printer, Scanner, or Fax… (or the + icon).</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#024AD8] font-bold mt-1">•</span>
                      <span>Select your HP printer from the list.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#024AD8] font-bold mt-1">•</span>
                      <span>In the Use dropdown, pick AirPrint if available, or download HP Easy Start from 123.hp.com/setup. Click Add.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#fff5f6] p-6 md:p-8 rounded-xl border border-gray-200 overflow-hidden">
                <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-[#024AD8] rounded-r-lg shadow-[6px_0_18px_rgba(2,74,216,0.12)]"></div>
                <div className="relative ml-4 md:ml-5">
                  <div className="flex items-center gap- mb-4">
                    <div className="w-8 h-8 bg-[#ff2d46] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                    <h3 className="text-lg font-bold text-dark">Step 3: Troubleshoot Your HP Printer on Mac</h3>
                  </div>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#ff2d46] font-bold mt-1">•</span>
                      <span><strong>Communication error:</strong> In Printers & Scanners, right-click your printer and choose "Reset printing system…" for a fresh start.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#ff2d46] font-bold mt-1">•</span>
                      <span><strong>AirPrint not found:</strong> If your printer isn't AirPrint-ready, install the HP driver (.dmg) from 123.hp.com/setup.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#ff2d46] font-bold mt-1">•</span>
                      <span><strong>Sleep mode:</strong> Some HP printers drop Wi-Fi in "Deep Sleep." Tap a button to wake it before printing.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Step Section - Redesigned */}
      <section className="py-10 md:py-14 px-4 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-[#024AD8]/10 rounded-full animate-pulse"></div>
            <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl border border-[#024AD8]/20">
              <span className="text-L leading-none">✅</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 bg-[#024AD8]/8 rounded-full px-3 py-1.5 mb-6 border border-[#024AD8]/15 shadow-sm">
            <span className="w-2 h-2 bg-[#024AD8] rounded-full block" aria-hidden="true"></span>
            <span className="text-[#024AD8] font-medium text-xs">Important final step</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-black">
            You're Almost Done! Print a Test Page
          </h2>

          <p className="text-black/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Confirm your printer is working perfectly. Open any document and print a test page to verify colors, alignment, and connection.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-[#f8fafc] rounded-3xl p-7 border border-[#024AD8]/10 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-[#024AD8]/10 rounded-2xl flex items-center justify-center text-[#024AD8]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0V3.449zm10.949-1.649L24 2.1v9.451H10.949V1.8zm-10.949 11.1H9.75v9.451l-9.75-1.35v-8.1zm10.949-1.35H24v9.451l-12.301-1.649v-7.802z"/>
                  </svg>
                </div>
                <span className="font-bold text-black text-lg">Windows</span>
              </div>
              <ol className="space-y-3 text-black text-sm">
                <li className="flex items-center gap-3"><span className="font-semibold">1.</span><span>Open any document</span></li>
                <li className="flex items-center gap-3"><span className="font-semibold text-[#024AD8]">2.</span><span>Press <kbd className="bg-black/5 px-2 py-1 rounded text-xs font-mono text-black">Ctrl + P</kbd></span></li>
                <li className="flex items-center gap-3"><span className="font-semibold">3.</span><span>Click Print</span></li>
              </ol>
            </div>

            <div className="bg-[#f8fafc] rounded-3xl p-7 border border-[#024AD8]/10 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-[#024AD8]/10 rounded-2xl flex items-center justify-center text-[#024AD8]">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <span className="font-bold text-black text-lg">Mac</span>
              </div>
              <ol className="space-y-3 text-black text-sm">
                <li className="flex items-center gap-3"><span className="font-semibold">1.</span><span>Open any document</span></li>
                <li className="flex items-center gap-3"><span className="font-semibold text-[#024AD8]">2.</span><span>Press <kbd className="bg-black/5 px-2 py-1 rounded text-xs font-mono text-black">Cmd + P</kbd></span></li>
                <li className="flex items-center gap-3"><span className="font-semibold">3.</span><span>Click Print</span></li>
              </ol>
            </div>
          </div>

          <div className="mt-5 pt-5">
            <div className="bg-[#ecf9f1] border border-[#d5edd8] rounded-3xl p-6 md:p-8 shadow-sm">
              <p className="text-slate-900 font-bold mb-5 text-base text-large ">After printing, check that:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-800 text-sm">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#34a853]"></span>
                  <span>Colors are vibrant</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#34a853]"></span>
                  <span>Text is crisp</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#34a853]"></span>
                  <span>No streaks or lines</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#34a853]"></span>
                  <span>Alignment is straight</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 px-4 bg-gray-50\">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-8\">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-dark">Still Need Help? Chat with an Expert Now</h2>
              <p className="text-gray-700 mb-6">
                Followed every step and your HP printer still won't set up or shows offline? Don't waste hours guessing. Connect with our support experts for real-time troubleshooting — we'll diagnose the exact cause, fix offline and connection errors, and get you printing again in minutes.
              </p>
              <JivoChatButton className="inline-block bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg">
                Start Live Chat — Fix It Now
              </JivoChatButton>
            </div>
            <div className="flex-1 lg:max-w-md">
              <Image src="/support.webp" alt="Support Team" width={768} height={512} className="w-full h-auto rounded-2xl shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 md:py-14 px-4 bg-gray-50\">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-dark">
            🛠️ HP Printer Setup, Offline & Troubleshooting – FAQ
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2 text-dark">How do I set up my HP printer using 123.hp.com/setup?</h3>
              <p className="text-gray-700">
                Go to 123.hp.com/setup, download the HP Smart app for your model, then follow the prompts to connect your printer to Wi-Fi and install the drivers. The full step-by-step process for Windows and Mac is covered in the guide above.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-dark">Why does my HP printer keep showing offline?</h3>
              <p className="text-gray-700">
                An HP printer offline status is usually caused by a Wi-Fi drop, a stuck print spooler, the "Use Printer Offline" setting being enabled, or an outdated driver. Restart the printer and router, uncheck offline mode, and restart the Print Spooler service to bring it back online.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-dark">How do I troubleshoot my HP printer when it won't print?</h3>
              <p className="text-gray-700">
                Check that the printer is powered on and connected to the same network as your device, clear any stuck jobs from the print queue, update or reinstall the driver from 123.hp.com/setup, and run a test print. If it still fails, reset the printing system (Mac) or restart the spooler (Windows).
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2 text-dark">Do I need a CD to install my HP printer?</h3>
              <p className="text-gray-700">
                No. Modern HP printers are set up entirely online through 123.hp.com/setup — just download the HP Smart app or the latest driver for your model and follow the on-screen steps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
