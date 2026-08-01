"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import BrandFooter from '../BrandFooter.jsx';
import ModelPage from './ModelPage.jsx';

const ModelSearch = () => {
    const [input, setInput] = useState("");
    const [error, setError] = useState("");
    const [allowModelSearch, setAllowModelSearch] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/printer-setup/settings')
            .then(res => res.json())
            .then(data => setAllowModelSearch(data.allowModelSearch !== false))
            .catch(() => setAllowModelSearch(true));
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
        setIsModalOpen(true);
    };

    return (
        <div className="w-full bg-white flex flex-col font-sans">
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
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder='e.g. "OfficeJet 9010"'
                                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                                disabled={!allowModelSearch}
                            />
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