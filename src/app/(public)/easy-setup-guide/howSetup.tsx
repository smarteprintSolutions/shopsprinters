import Image from "next/image";
import Link from "next/link";
import {
  Download,
  ClipboardCheck,
  Headset,
  MessageCircleMore,
} from "lucide-react";

const items = [
  {
    title: "Download Drivers",
    href: "/hp-smart-install",
    icon: Download,
  },
  {
    title: "Check Warranty Status",
    href: "/check-warranty",
    icon: ClipboardCheck,
  },
  {
    title: "Contact Us",
    href: "/hp-smart-install",
    icon: Headset,
  },
  {
    title: "Diagnose & Fix",
    href: "/hp-smart-install",
    icon: MessageCircleMore,
  },
];

export default function HowSetup() {
  return (
    // Reduced padding-top from py-12/py-16 down to pt-2 pb-12/pb-16
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
              <Link
                href="/easy-setup-guide/find-printer"
                className="rounded bg-[#024AD8] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#0138ab] shadow-sm text-center min-w-[140px]"
              >
                Printer Setup
              </Link>

              <Link
                href="/find-printer"
                className="text-sm font-medium text-[#024AD8] underline underline-offset-4 hover:text-[#0138ab] transition-colors"
              >
                Get Instant Support
              </Link>
            </div>

            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-lg font-semibold text-gray-900">
                More support
              </h3>

              <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
                Download drivers, check warranty, contact support or diagnose
                printer issues with a single click.
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Support Links */}
        <div className="mt-12 border-t border-b border-gray-200">
          
          {/* Enhanced responsive grid: 1 col on mobile, 2 cols on small tabs, 4 cols on larger desktop setups */}
          <div className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 sm:gap-px bg-gray-200 md:grid-cols-4">

            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={index}
                  href={item.href}
                  className="flex min-h-[140px] sm:min-h-[170px] flex-col items-center justify-center bg-white px-4 py-6 text-center transition hover:bg-gray-50/80 group"
                >
                  <Icon
                    size={38}
                    strokeWidth={1.5}
                    className="mb-4 text-[#024AD8] transition-transform duration-300 group-hover:scale-110"
                  />

                  <span className="text-sm sm:text-base font-medium text-[#024AD8] group-hover:underline">
                    {item.title}
                  </span>
                </Link>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}