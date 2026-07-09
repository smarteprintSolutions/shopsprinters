"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import SetupProgressModal from './SetupProgressModal1';

const CompleteSetup = ({ showCompleteSetup = false }: { showCompleteSetup?: boolean }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  if (!showCompleteSetup) {
    // fallback: redirect to easy setup guide
    if (typeof window !== 'undefined') router.replace('/easy-setup-guide/');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Complete Setup using Smart App</h1>
        <p className="text-gray-700 mb-6">Install the companion app to complete installation and drivers.</p>
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold"
          onClick={() => setShowModal(true)}
        >
          Install Smart App
        </button>
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <SetupProgressModal open={showModal} onClose={() => setShowModal(false)} onError={() => router.push('/installation-failed/')} />
        </div>
      )}
    </div>
  );
};

export default CompleteSetup;
