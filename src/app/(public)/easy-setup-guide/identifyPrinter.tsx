"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const PRINTER_MODELS = [
  "HP LaserJet M110w Wireless Black & White Printer",
  "HP LaserJet M140w Wireless Black & White Printer",
  "HP LaserJet Enterprise M507dn",
  "HP LaserJet MFP M234dw Printer",
  "HP LaserJet Enterprise M507n",
  "HP LaserJet M209dw Printer",
  "HP LaserJet Pro MFP 3101fdw Wireless",
  "HP LaserJet Pro 3001dw Wireless Printer",
  "HP LaserJet Enterprise M406dn",
  "HP LaserJet Enterprise MFP M430f",
  "HP LaserJet Pro 4001dw Wireless Printer",
  "HP LaserJet MFP M234sdw Printer",
  "HP LaserJet Pro M501dn",
  "HP LaserJet Tank MFP 2604sdw Printer",
  "HP LaserJet Pro MFP 4101fdn Printer",
  "HP LaserJet Pro 4001dn Printer",
  "HP LaserJet Pro MFP 4101fdw Wireless",
  "HP DeskJet 3755 All-in-One Printer",
  "HP Smart Tank 7001 All-in-One Printer",
  "HP Smart Tank 6001 All-in-One",
  "HP ENVY Inspire 7255e All-in-One Printer",
  "HP LaserJet Tank MFP 2604sdw",
  "HP ENVY 6055e All-in-One Printer",
  "HP OfficeJet Pro 9110b Wireless Printer",
  "HP Deskjet 4155e All-in-One Printer",
  "HP OfficeJet 8015e All-in-One Printer",
  "HP Smart Tank Plus 651",
  "HP OfficeJet Pro 8135e Wireless",
  "HP DeskJet 4255e All-in-One Printer",
  "HP DeskJet 2855e All-in-One Printer",
  "HP Smart Tank 5101 All-in-One Printer",
  "HP ENVY 6455e All-in-One Printer",
  "HP Smart Tank 7602 All-in-One",
  "HP Smart Tank 5000 All-in-One Printer",
  "HP OfficeJet Pro 9730e",
  "HP OfficeJet Pro 9125e All-in-One Printer",
  "HP ENVY Inspire 7955e All-in-One Printer",
  "HP Smart Tank 7301 All-in-One Printer",
  "HP OfficeJet Pro 9135e Wireless All-in-One Printer",
  "HP OfficeJet Pro 8034e All-in-One Printer",
  "HP Color LaserJet Pro MFP 3301fdw",
  "HP LaserJet Pro 4001dn",
  "HP DeskJet 1112",
  "HP DeskJet 2130",
  "HP DeskJet 2622",
  "HP DeskJet 3630",
  "HP DeskJet 3755",
  "HP Envy 4500",
  "HP Envy 5055",
  "HP Envy 5530",
  "HP Envy 7640",
  "HP Envy Photo 7855",
  "HP OfficeJet 3830",
  "HP OfficeJet 5255",
  "HP OfficeJet 6978",
  "HP OfficeJet 8025",
  "HP OfficeJet Pro 9015",
  "HP LaserJet Pro M15w",
  "HP LaserJet Pro MFP M29w",
  "HP LaserJet Pro MFP M130fw",
  "HP LaserJet Pro M404dn",
  "HP LaserJet Enterprise MFP M527f",
  "HP Color LaserJet Pro MFP M283fdw",
  "HP Color LaserJet Pro MFP M477fnw",
  "HP Color LaserJet Enterprise MFP M680f",
  "HP Color LaserJet Pro M452dw",
  "HP Color LaserJet Enterprise M751n",
  "HP PageWide Pro 477dw",
  "HP PageWide Pro 577dw",
  "HP PageWide Enterprise Color 556dn",
  "HP PageWide Managed Color MFP P77940dn",
  "HP PageWide Enterprise Color Flow MFP 785zs",
  "HP Tango",
  "HP Tango X",
  "HP DesignJet T120",
  "HP DesignJet T520",
  "HP DesignJet Z9+",
  "HP DesignJet T830",
  "HP DesignJet T2500",
  "HP Neverstop Laser 1000w",
  "HP Neverstop Laser MFP 1202w",
  "Photosmart A310 Printer",
  "Photosmart A430 Portable Photo Studio Series",
  "Officejet 6100 ePrinter series – H6",
  "Officejet 7110 Wide Format ePrinter series – H8",
  "Deskjet 310 / 310 with Sheetfeeder",
  "Deskjet 320 / 320 with Sheetfeeder"
];

const printerImages = [
  "/Deskjet.png",
  "/Envy.jpg",
  "/NSLaser.jpg",
];

const slides = [...printerImages, ...printerImages];

export default function IdentifyPrinter() {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

  // Handle live calculation of matched items based on typing string input
  useEffect(() => {
    if (!search.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    const query = search.toLowerCase();
    const filtered = PRINTER_MODELS.filter((model) =>
      model.toLowerCase().includes(query)
    );
    setFilteredSuggestions(filtered);
  }, [search]);

  // Handle closing autocomplete dropdown panel when clicking anywhere outside elements
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("printerModel", search.trim());
    }
    router.push("/hp-smart-install/");
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

          {/* Autocomplete wrapper container element */}
          <div ref={dropdownRef} className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setShowDropdown(false);
                }
              }}
              placeholder="Example: HP DeskJet 2632 All-in-One Printer"
              className="w-full rounded border border-gray-300 bg-white px-5 py-3 outline-none transition focus:border-[#024AD8] relative z-20"
            />

            {/* Suggestions Overlay Dropdown Menu */}
            {showDropdown && filteredSuggestions.length > 0 && (
              <ul className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded border border-gray-200 bg-white shadow-xl z-30 divide-y divide-gray-50">
                {filteredSuggestions.map((model, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => {
                        setSearch(model);       // Fills search field input text
                        setShowDropdown(false); // Only dismisses dropdown visibility
                      }}
                      className="w-full text-left px-5 py-3 text-sm text-gray-800 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 cursor-pointer"
                    >
                      {model}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleSearch}
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