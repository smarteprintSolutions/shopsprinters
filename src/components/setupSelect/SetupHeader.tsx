"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const SetupHeader = ({ showLogo = true, showHeader = true }: { showLogo?: boolean; showHeader?: boolean }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  if (!showHeader) return null;

  return (
    <header className="w-full h-24 bg-white py-3 flex items-center md:px-[6%] px-4 border-b border-gray-100 shadow-sm relative z-50">
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between md:justify-start">
        <div className="flex items-center gap-8">
          {showLogo && (
            <Link href="/search-model" className="inline-flex items-center">
              <img
                src="/hp-logo.svg"
                alt="HP Logo"
                className="h-14 w-auto mr-4 hover:opacity-80 transition"
                width={56}
                height={56}
              />
            </Link>
          )}
          <ul className="hidden md:flex flex-row gap-10 items-center">
            <li className="text-gray-500 text-lg font-normal hover:text-blue-600 cursor-pointer transition">OfficeJet</li>
            <li className="text-gray-500 text-lg font-normal hover:text-blue-600 cursor-pointer transition">DeskJet</li>
            <li className="text-gray-500 text-lg font-normal hover:text-blue-600 cursor-pointer transition">ENVY</li>
            <li className="text-gray-500 text-lg font-normal hover:text-blue-600 cursor-pointer transition">LaserJet</li>
          </ul>
        </div>

        <div className="md:hidden flex items-center">
          <button
            aria-label="Open menu"
            className="focus:outline-none p-2 rounded-md hover:bg-gray-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              className="w-7 h-7 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <ul className="absolute top-20 left-0 w-full bg-white shadow-xl flex flex-col items-center gap-6 py-8 z-50 md:hidden">
            <li className="text-gray-600 text-xl font-medium hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>OfficeJet</li>
            <li className="text-gray-600 text-xl font-medium hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>DeskJet</li>
            <li className="text-gray-600 text-xl font-medium hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>ENVY</li>
            <li className="text-gray-600 text-xl font-medium hover:text-blue-600 transition" onClick={() => setMenuOpen(false)}>LaserJet</li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default SetupHeader;
