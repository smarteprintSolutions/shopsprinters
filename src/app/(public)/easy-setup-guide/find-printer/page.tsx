"use client";
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import ModelPage from './ModelPage.jsx';
import BrandFooter from "../BrandFooter.jsx";
import Header from '../Header.jsx';

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

const ModelSearch = () => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [allowModelSearch, setAllowModelSearch] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Autocomplete states & refs
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/api/printer-setup/settings')
            .then(res => res.json())
            .then(data => setAllowModelSearch(data.allowModelSearch !== false))
            .catch(() => setAllowModelSearch(true));
    }, []);

    // Filter models whenever typing occurs
    useEffect(() => {
        if (!input.trim()) {
            setFilteredSuggestions([]);
            return;
        }

        const query = input.toLowerCase();
        const filtered = PRINTER_MODELS.filter((model) =>
            model.toLowerCase().includes(query)
        );
        setFilteredSuggestions(filtered);
    }, [input]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!allowModelSearch) return;

        if (input.trim() === "") {
            setError("Please enter your model number.");
            return;
        }
        window.localStorage.setItem('modelSearchInput', input.trim());
        setError("");
        setShowDropdown(false);
        setIsModalOpen(true);
    };

    const handleSelectSuggestion = (model: string) => {
        setInput(model);
        setShowDropdown(false);
        setError("");
    };

    return (
        <div className="w-full bg-white flex flex-col font-sans">

            <Header />
            {/* Modal Component */}
            <ModelPage isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

            {/* Top Hero Banner */}
            <section
                className="w-full min-h-[360px] md:min-h-[400px] flex items-center justify-center relative px-4 md:px-12"
                style={{
                    backgroundImage: 'url(/hero_background_image.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="w-full max-w-[1280px] flex md:flex-row flex-col items-center justify-between relative py-8 gap-8">
                    {/* Left Hero Content */}
                    <div className="flex flex-col text-white max-w-[550px] z-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">
                            Quick Printer Drivers
                        </h1>
                        <ul className="space-y-2 mb-6 text-sm md:text-base font-light">
                            <li className="flex items-center gap-2">
                                <span className="text-xs">●</span> Make sure your printer is powered on
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-xs">●</span> Click on Download to install the drivers
                            </li>
                        </ul>
                        <div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-[#00a8e8] hover:bg-[#0092cd] text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors shadow-md"
                            >
                                Download Now <span>↓</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Hero Printer Cluster Image */}
                    <div className="flex justify-center items-center w-full max-w-[320px] md:max-w-[360px]">
                        <img
                            src="/hp-printers-stack.png"
                            alt="Printer Models"
                            className="w-full h-auto object-contain drop-shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* Form & Instructions Section */}
            <section id="search-form-section" className="w-full bg-[#f8f9fa] py-16 md:py-20 px-4 md:px-12 min-h-[45vh]">
                <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12">

                    {/* Left Form Box */}
                    <div className="w-full md:w-[48%] flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Quick Download Printer Drivers
                        </h2>
                        <p className="text-gray-800 text-sm font-semibold mb-6">
                            Fill the form and find your printer driver
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <label className="text-xs text-gray-600 font-medium">
                                Model Number:
                            </label>
                            
                            {/* Input container with autocomplete menu */}
                            <div ref={dropdownRef} className="relative w-full">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => {
                                        setInput(e.target.value);
                                        setShowDropdown(true);
                                    }}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder='e.g. "OfficeJet 9010"'
                                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                                    disabled={!allowModelSearch}
                                />

                                {/* Suggestions Overlay Dropdown Menu */}
                                {showDropdown && filteredSuggestions.length > 0 && (
                                    <ul className="absolute left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded border border-gray-200 bg-white shadow-xl z-30 divide-y divide-gray-50">
                                        {filteredSuggestions.map((model, idx) => (
                                            <li key={idx}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectSuggestion(model)}
                                                    className="w-full text-left px-4 py-2.5 text-xs md:text-sm text-gray-800 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150 cursor-pointer"
                                                >
                                                    {model}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {error && <span className="text-red-500 text-xs">{error}</span>}

                            <div className="mt-2">
                                <button
                                    type="submit"
                                    className="bg-[#279ACB] hover:bg-[#1f7fb4] text-white text-xs md:text-sm font-bold py-2.5 px-5 rounded inline-flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    Quick Download & Install Drivers! <span>↓</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right How to Find Model Section */}
                    <div className="w-full md:w-[48%] flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            How to find printer model number?
                        </h3>
                        <p className="text-gray-500 text-xs mb-6">
                            The product name is on the front of your device.
                        </p>

                        <div className="w-full flex justify-center items-center pt-2">
                            <img
                                src="/hp-model-guide.png"
                                alt="How to find model number"
                                className="max-w-[340px] md:max-w-[380px] w-full h-auto object-contain"
                            />
                        </div>
                    </div>

                </div>
            </section>

            <BrandFooter />
        </div>
    );
};

export default ModelSearch;