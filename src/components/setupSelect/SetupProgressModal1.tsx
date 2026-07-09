"use client";
import React, { useEffect, useRef, useState } from 'react';
// small, dependency-free icons (emoji/SVG) used instead of react-icons

function getDefaultSteps() {
  return [
    { label: 'Checking Device Compatibility', right: 'Verified', progress: 0, status: '' },
    { label: `Downloading Drivers for Printer`, right: 'Completed', progress: 0, status: '' },
    { label: 'Installing Package...', right: 'Initializing Installation...', progress: 0, status: '' },
  ];
}

export default function SetupProgressModal({ open, onClose, onError }: any) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [stepStates, setStepStates] = useState(getDefaultSteps);

  useEffect(() => {
    if (!open) return;
    const fresh = getDefaultSteps();
    setStepStates(fresh);
    let timers: any[] = [];

    function animateStep(idx: number) {
      setStepStates((prev) => prev.map((s, i) => (i < idx ? { ...s, progress: 100, status: 'done' } : i === idx ? { ...s, progress: 0, status: 'active' } : s)));
      let prog = 0;
      const interval = setInterval(() => {
        prog += 5;
        setStepStates((prev) => prev.map((s, i) => (i === idx ? { ...s, progress: Math.min(prog, 100), status: 'active' } : s)));
        if (idx === 2 && prog >= 60) {
          clearInterval(interval);
          setStepStates((prev) => prev.map((s, i) => (i === idx ? { ...s, progress: 60, status: 'active' } : s)));
          timers.push(setTimeout(() => { if (onError) onError(); }, 4000));
        } else if (prog >= 100) {
          clearInterval(interval);
          setStepStates((prev) => prev.map((s, i) => (i === idx ? { ...s, progress: 100, status: 'done' } : s)));
          if (idx < fresh.length - 1) timers.push(setTimeout(() => animateStep(idx + 1), 500));
        }
      }, 25);
      timers.push(interval);
    }

    timers.push(setTimeout(() => animateStep(0), 400));
    return () => timers.forEach((t) => clearInterval(t));
  }, [open, onError]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-gray-50">
          <span className="text-gray-400 mr-2 animate-spin" aria-hidden>⚙️</span>
          <span className="font-semibold text-gray-700">Device Setup Assistant</span>
          <div className="ml-auto flex gap-2">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-400" />
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-yellow-400" />
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-green-400" />
          </div>
        </div>
        <div className="px-5 py-6">
          <div className="space-y-6">
            {stepStates.map((step) => (
              <div key={step.label} className="relative">
                <div className="flex items-start">
                  <div className="mr-4 mt-1">
                    {step.status === 'done' ? <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600">✓</div> : step.status === 'active' ? <div className="w-6 h-6 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div> : <div className="w-6 h-6 border-2 border-gray-200 rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className={`font-semibold ${step.status === 'active' ? 'text-blue-700' : 'text-gray-700'}`}>{step.label}</span>
                      {step.status === 'done' && <span className="text-xs font-medium text-green-600">{step.right}</span>}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
                      <div className="h-full bg-blue-600 transition-all" style={{ width: `${step.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
