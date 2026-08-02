"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Printer,
  Wifi,
  Sparkles,
  Headset,
  ShieldCheck,
} from "lucide-react";

// Items from SS2
const supportCards = [
  {
    title: "Printer Set Up Issue",
    icon: Printer,
  },
  {
    title: "Printer Offline",
    icon: Printer,
  },
  {
    title: "Wireless printer issue",
    icon: Wifi,
  },
  {
    title: "Paper jam issue",
    icon: Sparkles,
  },
  {
    title: "Printer Job Stuck In Queue",
    icon: Headset,
  },
  {
    title: "Scanner issues",
    icon: ShieldCheck,
  },
];

export default function HowSetup() {
  // Helper to trigger Jivo Chat on click
  const openJivoChat = () => {
    if (typeof window === "undefined") return;
    const w = window as any;
    if (w.jivo_api && typeof w.jivo_api.open === "function") {
      w.jivo_api.open();
      return;
    }
    if (w.jivo_api && typeof w.jivo_api.show === "function") {
      w.jivo_api.show();
      return;
    }
    if (w.Jivo_API && typeof w.Jivo_API.open === "function") {
      w.Jivo_API.open();
    }
  };

  const [allowStartNow, setAllowStartNow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/printer-setup/settings')
      .then(res => res.json())
      .then(data => setAllowStartNow(data.allowStartNow === true))
      .catch(() => setAllowStartNow(false));
  }, []);

  const handlePrinterSetupClick = () => {
    if (allowStartNow) {
      router.push('/easy-setup-guide/find-printer');
    } else {
      openJivoChat();
    }
  };

  return (
    <section className="bg-white pt-2 pb-12 lg:pb-16">
      <div className="mx-auto max-w-7xl px-4">

        {/* Top Section */}
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">

          {/* Image */}
          <div className="overflow-hidden rounded-lg bg-gray-50 aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto">
            <Image
              src="/how-to-setup.jpg"
              alt="Printer Setup"
              width={700}
              height={450}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-102"
              priority
            />
          </div>

          {/* Content */}
          <div className="w-full">

            <h2 className="text-2xl font-light leading-tight text-gray-900 sm:text-3xl lg:text-[40px]">
              How to setup your printer
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
              Click Printer Setup for step by step guidance on how to setup,
              configure and register your printer.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handlePrinterSetupClick}
                className="rounded bg-[#024AD8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0138ab] shadow-sm text-center min-w-[140px]"
              >
                Click Here For Printer Setup
              </button>

              <button
                type="button"
                onClick={openJivoChat}
                className="text-sm font-medium text-[#024AD8] underline underline-offset-4 hover:text-[#0138ab] transition-colors"
              >
                Get Instant Support
              </button>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                More support
              </h3>

              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                Need additional assistance? Select your printer issue below to access step-by-step guidance, helpful resources, and personalized support from our specialists.
              </p>
            </div>

          </div>
        </div>

        {/* SS2 Style Replacement Cards */}
        <div className="mt-12">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {supportCards.map((item, index) => {
              const Icon = item.icon;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={openJivoChat}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group text-center h-full min-h-[160px]"
                >
                  <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-[#024AD8] transition-transform duration-300 group-hover:scale-110">
                    <Icon size={24} strokeWidth={2} />
                  </div>

                  <span className="text-xs sm:text-sm font-bold text-gray-900 leading-snug group-hover:text-[#024AD8] transition-colors">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}