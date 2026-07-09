import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-dark mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block bg-[#024AD8] text-white px-8 py-3 rounded-2xl hover:bg-[#01369e] transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}
