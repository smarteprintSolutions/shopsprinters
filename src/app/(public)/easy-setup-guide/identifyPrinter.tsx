"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

const printerImages: string[] = [
  "/Deskjet.png",
  "/Envy.jpg",
  "/NSLaser.jpg",
];

const slides: string[] = [...printerImages, ...printerImages];

export default function IdentifyPrinter(): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [animate, setAnimate] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");

  // Auto slider loop logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (current === printerImages.length) {
      const timeout = setTimeout(() => {
        setAnimate(false);
        setCurrent(0);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setAnimate(true);
          });
        });
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [current]);

  const handleSearch = (e?: React.FormEvent | React.MouseEvent): void => {
    if (e) {
      e.preventDefault();
    }
    // Do nothing
  };

  return (
    <section className="bg-[#f7f8fa] py-12">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">

        {/* Left Container */}
        <div className="max-w-xl relative">
          <Search
            size={42}
            strokeWidth={1.7}
            className="mb-5 text-[#024AD8]"
          />

          <h2 className="text-4xl font-light leading-tight text-gray-900">
            Identify your printer for manuals and product information
          </h2>

          <p className="mt-8 mb-2 text-sm text-gray-700">
            Enter your serial number, product number or product name
          </p>

          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e);
                }
              }}
              placeholder="Example: HP DeskJet 2632 All-in-One Printer"
              className="w-full rounded border border-gray-300 bg-white px-5 py-3 outline-none transition focus:border-[#024AD8] relative z-20"
            />
          </div>

          <button
            type="button"
            onClick={(e) => handleSearch(e)}
            className="mt-5 rounded bg-[#024AD8] cursor-pointer px-7 py-3 font-medium text-white transition hover:bg-[#0138ab]"
          >
            Submit
          </button>
        </div>

        {/* Right Slider */}
        <div className="relative h-[260px] overflow-hidden border-l border-gray-300 pl-8 hidden lg:block">
          <div
            className={`flex h-full ${
              animate ? "transition-transform duration-700 ease-in-out" : ""
            }`}
            style={{
              width: `${slides.length * 100}%`,
              transform: `translateX(-${
                current * (100 / slides.length)
              }%)`,
            }}
          >
            {slides.map((image, index) => (
              <div
                key={index}
                className="relative h-full flex-shrink-0"
                style={{
                  width: `${100 / slides.length}%`,
                }}
              >
                <Image
                  src={image}
                  alt={`Printer ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}