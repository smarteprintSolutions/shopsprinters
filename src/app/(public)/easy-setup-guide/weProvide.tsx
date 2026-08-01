"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Extend the global Window interface to recognize Jivo API
declare global {
  interface Window {
    jivo_api?: {
      open?: () => void;
      show?: () => void;
    };
    Jivo_API?: {
      open?: () => void;
    };
  }
}

interface ServiceItem {
  image: string;
  title: string;
  description: string;
  button: string;
}

const services: ServiceItem[] = [
  {
    image: "/window-11.png",
    title: "Get Instant Support for Laptop & Desktop",
    description:
      "If your Windows laptop or desktop isn't working properly, connect with our support experts for quick troubleshooting and assistance.",
    button: "Install HP Smart",
  },
  {
    image: "/scan-print-fix.png",
    title: "How to print, scan and fax",
    description:
      "Learn how to print, scan and fax using your printer with easy step-by-step instructions for Windows and macOS.",
    button: "Fix Scan/Print",
  },
  {
    image: "/printer-offline.png",
    title: "Printer offline or print job stuck in queue?",
    description:
      "Resolve printer offline errors and stuck print jobs using our guided troubleshooting and repair tools.",
    button: "Fix your Printer",
  },
];

function openJivoChat(): void {
  if (typeof window === "undefined") return;

  if (typeof window.jivo_api?.open === "function") {
    window.jivo_api.open();
    return;
  }
  if (typeof window.jivo_api?.show === "function") {
    window.jivo_api.show();
    return;
  }
  if (typeof window.Jivo_API?.open === "function") {
    window.Jivo_API.open();
  }
}

export default function WeProvide(): React.JSX.Element {
  const router = useRouter();
  const [allowStartNow, setAllowStartNow] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/printer-setup/settings")
      .then((res) => res.json())
      .then((data: { allowStartNow?: boolean }) => {
        if (isMounted) {
          setAllowStartNow(data.allowStartNow === true);
        }
      })
      .catch(() => {
        if (isMounted) setAllowStartNow(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleActionClick = (): void => {
    if (allowStartNow) {
      router.push("/easy-setup-guide/find-printer");
    } else {
      openJivoChat();
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">
            We Provide Solutions for
          </h2>

          <p className="mt-3 text-sm text-gray-500 md:text-base">
            Storage | Software Download | Installation Issues | Network
            Connectivity Related Issues
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item: ServiceItem, index: number) => (
            <div
              key={index}
              className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6"
            >
              {/* Image */}
              <div className="flex h-24 items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={150}
                  height={90}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="mt-5 min-h-[60px] text-center text-2xl font-medium leading-snug text-gray-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="mt-3 min-h-[96px] text-center text-[15px] leading-6 text-gray-600">
                {item.description}
              </p>

              {/* Action Button */}
              <div className="mt-auto pt-5 text-center">
                <button
                  type="button"
                  onClick={handleActionClick}
                  className="inline-flex rounded bg-[#024AD8] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0138ab] cursor-pointer"
                >
                  {item.button}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}