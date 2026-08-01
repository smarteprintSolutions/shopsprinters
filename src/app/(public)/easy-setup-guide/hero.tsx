"use client";

import React from "react";
import Image from "next/image";

export default function Hero() {
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

  return (
    <section className="bg-white py-6 lg:py-10">
      <div className="mx-auto max-w-[1450px] px-4">
        <div className="relative overflow-hidden rounded-lg bg-[#024AD8]">

          {/* Content */}
          <div className="grid min-h-[560px] lg:grid-cols-[62%_38%]">

            {/* Left */}
            <div className="relative z-20 flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">

              {/* Heading Section */}
              <div className="flex items-center gap-5">
                <div>
                  <h1 className="text-3xl font-semibold leading-tight text-white md:text-4xl xl:text-5xl">
                   Printer Help Center
                  </h1>

                  <p className="mt-3 max-w-xl text-base leading-7 text-white/90 md:text-lg">
                    Speak directly with a live printer specialist for fast and reliable assistance.
                  </p>
                </div>
              </div>

              {/* Card */}
              <div className="mt-10 w-full max-w-[880px] rounded-2xl border border-gray-200 bg-white p-6 md:p-8 lg:p-10">

                {/* Phone */}
                <div className="flex items-center gap-5">

                  <div className="flex h-14 w-14 items-center justify-center md:h-16 md:w-16">
                    <Image
                      src="/support-icon.svg"
                      alt="Customer Support"
                      width={64}
                      height={64}
                      className="h-full w-full object-contain cursor-pointer"
                      priority
                      onClick={openJivoChat}
                    />
                  </div>

                  <a
                    href="tel:+18881234567"
                    className="break-all text-3xl font-light tracking-tight text-[#024AD8] md:text-4xl xl:text-5xl"
                  >
                    +1 (877) 238-0240 
                  </a>

                </div>

                <div className="my-7 h-px bg-gray-200" />

                {/* Bullet Points */}
                <ul className="ml-5 list-disc space-y-4 text-[15px] leading-7 text-gray-700">

                  <li>
                    Get prompt assistance from experienced printer specialists for setup, installation, and troubleshooting.
                  </li>

                  <li>
                    We&apos;re here to help you resolve printer-related issues, answer your questions, and guide you through installation, wireless connectivity, driver setup, and everyday printing concerns.
                  </li>

                </ul>

                {/* Chat Action Button */}
                <button
                  type="button"
                  onClick={openJivoChat}
                  className="mt-7 inline-block text-left text-base font-medium text-[#024AD8] transition hover:underline cursor-pointer"
                >
                  Chat with a Live Specialist for troubleshooting guides, helpful resources, and additional support information. &rarr;
                </button>

              </div>

            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">

              <div
                className="absolute inset-0"
                style={{
                  clipPath: "polygon(13% 0%,100% 0%,100% 100%,0% 100%)",
                }}
              >
                <Image
                  src="/hero-home.webp"
                  alt="Customer Support"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

            </div>

          </div>

          {/* Mobile Image */}
          <div className="relative h-[260px] lg:hidden">
            <Image
              src="/hero-home.webp"
              alt="Customer Support"
              fill
              priority
              className="object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
}