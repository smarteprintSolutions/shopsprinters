"use client";
import React, { useState, useEffect } from "react";

export default function ModelPage({ isOpen, onClose }) {
  // Sequence Mapping:
  // 1: Let's Start Wizard
  // 1_loading: Loading Spinner right under header border - 4 seconds
  // 2: Choose Connection Type (USB / WiFi)
  // 3_usb / 3_wifi: Searching - cycles 3 messages every 2 seconds (total 15s)
  // 4_usb / 4_wifi: "Loading Error..." (Red Text) - 10 ms
  // 5_usb / 5_wifi: Points 1 & 2 directly under Loading Error for 3 seconds
  // failed_usb / failed_wifi: Connection Failed screen
  // 6: Detecting problems (5 sentences, 20% steps, 6 seconds total duration)
  // 7: Error Code 0x00000709 Final Page

  const [step, setStep] = useState("1");
  const [troubleshootPoint, setTroubleshootPoint] = useState(0);
  const [detectingTextIndex, setDetectingTextIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [searchMsgIndex, setSearchMsgIndex] = useState(0);

  const usbSearchMessages = [
    "Searching for USB Ports...",
    "Checking Printer Spooler...",
    "Checking Printer Drivers...",
    "Checking Installation Files..."
  ];

  const wifiSearchMessages = [
    "Searching for Wifi network...",
    "Checking Printer Spooler...",
    "Checking Installation Files..."
  ];

  // 5 Sentences for the Detecting Phase
  const detectingMessages = [
    "Gathering information about your devices...",
    "Checking the spooler service...",
    "checking printer registry files...",
    "Checking for a default printer...",
    "Checking for errors from the printer driver...",
  ];

  useEffect(() => {
    if (isOpen) {
      setStep("1");
      setTroubleshootPoint(0);
      setDetectingTextIndex(0);
      setProgressPercent(0);
      setSearchMsgIndex(0);
    }
  }, [isOpen]);

  // Handle dynamic cycling of search text every 2 seconds
  useEffect(() => {
    let searchInterval;
    if (step === "3_usb" || step === "3_wifi") {
      setSearchMsgIndex(0);
      searchInterval = setInterval(() => {
        setSearchMsgIndex((prev) => (prev + 1) % 3);
      }, 2000);
    }
    return () => clearInterval(searchInterval);
  }, [step]);

  useEffect(() => {
    let timer;

    // STEP 1_LOADING: Spinner screen shown for 4 seconds
    if (step === "1_loading") {
      timer = setTimeout(() => {
        setStep("2");
      }, 4000);
    }

    // STEP 3: Searching runs for 15 seconds
    else if (step === "3_usb") {
      timer = setTimeout(() => setStep("4_usb"), 15000);
    } else if (step === "3_wifi") {
      timer = setTimeout(() => setStep("4_wifi"), 15000);
    }

    // STEP 4: "Loading Error..." shown for 10 ms
    else if (step === "4_usb") {
      timer = setTimeout(() => {
        setStep("5_usb");
        setTroubleshootPoint(0);
      }, 10);
    } else if (step === "4_wifi") {
      timer = setTimeout(() => {
        setStep("5_wifi");
        setTroubleshootPoint(0);
      }, 10);
    }

    // STEP 5: Reveal Point 1, then Point 2, hold for 3 seconds
    else if (step === "5_usb" || step === "5_wifi") {
      if (troubleshootPoint === 0) {
        timer = setTimeout(() => setTroubleshootPoint(1), 300);
      } else if (troubleshootPoint === 1) {
        timer = setTimeout(() => setTroubleshootPoint(2), 500);
      } else if (troubleshootPoint === 2) {
        timer = setTimeout(() => {
          setStep(step === "5_usb" ? "failed_usb" : "failed_wifi");
        }, 3000);
      }
    }

    // STEP 6: Progress increases by 20% every 1.2s across 5 steps (Total: 6 seconds)
    else if (step === "6") {
      if (detectingTextIndex === 0 && progressPercent === 0) {
        timer = setTimeout(() => setProgressPercent(20), 100);
      } else if (detectingTextIndex < detectingMessages.length - 1) {
        timer = setTimeout(() => {
          setDetectingTextIndex((prev) => prev + 1);
          setProgressPercent((prev) => Math.min(prev + 20, 100));
        }, 1200); // 1200ms x 5 steps = 6000ms (6 seconds total)
      } else {
        timer = setTimeout(() => {
          setProgressPercent(100);
          setTimeout(() => setStep("7"), 400);
        }, 1200);
      }
    }

    return () => clearTimeout(timer);
  }, [step, troubleshootPoint, detectingTextIndex, progressPercent]);

  const handleStartDiagnostics = () => {
    setDetectingTextIndex(0);
    setProgressPercent(0);
    setStep("6");
  };

  const handleOpenChat = () => {
    if (window.jivo_api && typeof window.jivo_api.open === "function") {
      window.jivo_api.open();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 font-sans">
      {/* Modal Container */}
      <div className="relative w-full max-w-[480px] h-[520px] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-bold text-gray-800 tracking-tight leading-none">
            Quick Download Free Drivers
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors leading-none cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 pt-5 pb-6 flex-1 flex flex-col items-center text-center overflow-hidden">

          {/* STEP 1: Let's Start Wizard */}
          {step === "1" && (
            <div className="w-full h-full flex flex-col items-center justify-start space-y-4 pt-2">
              <button
                onClick={() => setStep("1_loading")}
                className="bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-2.5 px-7 rounded-lg flex items-center gap-2 shadow-xs transition-all active:scale-[0.99] text-base cursor-pointer"
              >
                Let's Start ➔
              </button>
              <p className="text-gray-700 font-medium text-base">Start Printer Setup Wizard</p>
              <div className="pt-3 max-w-[260px]">
                <img src="/wizard-start-box.png" alt="Printer Box" className="w-full h-auto object-contain" />
              </div>
            </div>
          )}

          {/* STEP 1_LOADING: Spinner placed directly below the header border */}
          {step === "1_loading" && (
            <div className="w-full h-full flex flex-col items-center justify-start pt-16 animate-in fade-in duration-300">
              <div className="w-12 h-12 border-4 border-[#1877F2] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* STEP 2: Connection Options */}
          {step === "2" && (
            <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
              <div className="w-full border-b border-gray-100 pb-3 mb-4">
                <p className="text-gray-800 text-left text-base font-semibold">Select Wi-Fi or USB connection?</p>
              </div>

              <div className="space-y-4 pt-1">
                {/* USB Option */}
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-3">
                    <img src="/usb-setup.jpg" alt="USB" className="w-16 h-auto object-contain" />
                    <div className="text-left">
                      <span className="font-bold text-gray-900 text-base">USB: </span>
                      <span className="text-gray-600 text-sm">Connect via USB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("3_usb")}
                    className="bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    Let's Start ➔
                  </button>
                </div>

                {/* WIFI Option */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <img src="/wifi-setup.png" alt="WIFI" className="w-16 h-auto object-contain" />
                    <div className="text-left">
                      <span className="font-bold text-gray-900 text-base">WIFI: </span>
                      <span className="text-gray-600 text-sm">Connect via Wifi.</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("3_wifi")}
                    className="bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                  >
                    Let's Start ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Searching Phase */}
          {(step === "3_usb" || step === "3_wifi") && (
            <div className="w-full h-full flex flex-col items-center justify-start">
              <div className="w-full border-b border-gray-100 pb-3 mb-6">
                <p className="text-gray-600 text-base text-center leading-relaxed">
                  Verify your printer's {step === "3_usb" ? "USB" : "Wifi"} connection for a seamless setup process.
                </p>
              </div>

              <img
                src={step === "3_usb" ? "/usb-setup.jpg" : "/wifi-setup.png"}
                alt="Printer Connection"
                className="w-32 h-auto object-contain my-3"
              />

              <div className="flex items-center gap-2.5 text-gray-700 text-base font-medium mt-6 transition-all duration-300">
                <span className="w-5 h-5 border-2 border-[#1877F2] border-t-transparent rounded-full animate-spin"></span>
                <span>
                  {step === "3_usb" ? usbSearchMessages[searchMsgIndex] : wifiSearchMessages[searchMsgIndex]}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: "Loading Error..." in Red */}
          {(step === "4_usb" || step === "4_wifi") && (
            <div className="w-full h-full flex flex-col items-center justify-start">
              <div className="w-full border-b border-gray-100 pb-3 mb-6">
                <p className="text-gray-600 text-base text-center leading-relaxed">
                  Verify your printer's {step === "4_usb" ? "USB" : "Wifi"} connection for a seamless setup process.
                </p>
              </div>

              <img
                src={step === "4_usb" ? "/usb-setup.jpg" : "/wifi-setup.png"}
                alt="Printer Connection"
                className="w-32 h-auto object-contain my-3"
              />

              <div className="flex items-center gap-2.5 text-red-600 font-semibold text-base mt-6">
                <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Loading Error...</span>
              </div>
            </div>
          )}

          {/* STEP 5: Points 1 & 2 */}
          {(step === "5_usb" || step === "5_wifi") && (
            <div className="w-full h-full flex flex-col items-center justify-start animate-in fade-in duration-300">
              {/* Subheading with border */}
              <div className="w-full border-b border-gray-100 pb-3 mb-4">
                <p className="text-gray-600 text-base text-center leading-relaxed">
                  Verify your printer's {step === "5_usb" ? "USB" : "Wifi"} connection for a seamless setup process.
                </p>
              </div>

              {/* Restored image size */}
              <img
                src={step === "5_usb" ? "/usb-setup.jpg" : "/wifi-setup.png"}
                alt="Printer Connection"
                className="w-32 h-auto object-contain my-2"
              />

              {/* Spaced out Loading Error block */}
              <div className="flex items-center justify-center gap-2.5 text-red-600 font-semibold text-base my-4">
                <span className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                <span>Loading Error...</span>
              </div>

              {/* Clean spaced troubleshooting points */}
              <div className="text-gray-700 text-sm font-medium space-y-3 text-center pt-2 max-w-sm">
                {troubleshootPoint >= 1 && (
                  <p className="animate-in fade-in duration-300 leading-normal">
                    1. Check {step === "5_usb" ? "USB cable connected both side" : "Wifi connection status"}
                  </p>
                )}
                {troubleshootPoint >= 2 && (
                  <p className="animate-in fade-in duration-300 leading-normal">
                    2. Check your device driver ({step === "5_usb" ? "USB Ports Drivers" : "Wireless Drivers"})
                  </p>
                )}
              </div>
            </div>
          )}

          {/* FAILED SCREEN */}
          {(step === "failed_usb" || step === "failed_wifi") && (
            <div className="w-full h-full flex flex-col items-center justify-between animate-in fade-in zoom-in-95 duration-200">
              <div className="w-full border-b border-gray-100 pb-3">
                <p className="text-gray-600 text-base text-center leading-relaxed">
                  Verify your printer's {step === "failed_usb" ? "USB" : "Wifi"} connection for a seamless setup process.
                </p>
              </div>

              <img
                src={step === "failed_usb" ? "/usb-setup.jpg" : "/wifi-setup.png"}
                alt="Connection"
                className="w-24 h-auto object-contain my-1"
              />

              <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                {step === "failed_usb" ? "USB connection failed." : "Wifi connection failed."}
              </h3>

              <div className="w-full max-w-sm border border-gray-200 rounded-xl divide-y divide-gray-100 text-xs text-gray-700 bg-white shadow-2xs">
                <div className="py-2.5 px-4 flex justify-between items-center">
                  <span className="font-medium text-xs">{step === "failed_usb" ? "Check USB on both ends." : "Check Wifi status."}</span>
                  <button onClick={handleStartDiagnostics} className="text-[#1877F2] font-semibold hover:underline text-xs cursor-pointer">
                    Retry
                  </button>
                </div>
                <div className="py-2.5 px-4 flex justify-between items-center">
                  <span className="font-medium text-xs">{step === "failed_usb" ? "Check USB drivers." : "Check Wireless drivers."}</span>
                  <button onClick={handleStartDiagnostics} className="text-[#1877F2] font-semibold hover:underline text-xs cursor-pointer">
                    Check Drivers
                  </button>
                </div>
              </div>

              <div className="w-full max-w-xs space-y-2 pt-1">
                <button
                  onClick={handleOpenChat}
                  className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-xs cursor-pointer"
                >
                  Chat Now
                </button>
                <a
                  href="tel:+18556184642"
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  Call Toll Free: +1 (877) 238-0240
                </a>
              </div>
            </div>
          )}

          {/* STEP 6: Detecting Problems State */}
          {step === "6" && (
            <div className="w-full h-full flex flex-col justify-start items-start space-y-5 text-left pt-2 animate-in fade-in duration-300">
              <h3 className="text-2xl font-bold text-[#1877F2]">Detecting problems</h3>

              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#1877F2] h-2 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <p className="text-gray-600 text-sm font-medium pt-1 transition-all duration-300">
                {detectingMessages[detectingTextIndex]}
              </p>
            </div>
          )}

          {/* STEP 7: Final Error Code Page */}
          {step === "7" && (
            <div className="w-full h-full flex flex-col items-center justify-start text-center space-y-5 pt-2 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-center gap-2.5 text-[#E53935]">
                <svg className="w-8 h-8 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-bold tracking-tight">Error Code 0x00000709</h3>
              </div>

              <div className="space-y-1.5 max-w-sm pt-1">
                <p className="text-gray-700 text-sm font-medium leading-relaxed">
                  Registry error found, please check your registry files settings or reinstall drivers.
                </p>
                <p className="text-gray-500 text-xs">
                  Access specialized expertise.
                </p>
              </div>

              <div className="w-full space-y-2.5 max-w-xs pt-4">
                <button
                  onClick={handleOpenChat}
                  className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-xs cursor-pointer"
                >
                  Chat Now
                </button>
                <a
                  href="tel:+18556184642"
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center transition-colors cursor-pointer"
                >
                  Call Toll Free: +1 (877) 238-0240
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}