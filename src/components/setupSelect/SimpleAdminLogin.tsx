"use client";
import React, { useState } from 'react';

export default function SimpleAdminLogin({ onLogin, error }: { onLogin: (u: string, p: string) => void; error?: string }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <p className="text-sm text-gray-500 mb-6">Sign in to manage setup flow settings</p>
        <label className="block mb-2 font-medium">Username</label>
        <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" />
        <label className="block mb-2 font-medium">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 px-4 py-2 border rounded" />
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="flex justify-end">
          <button onClick={() => onLogin(username, password)} className="bg-blue-600 text-white px-6 py-2 rounded">Sign in</button>
        </div>
      </div>
    </div>
  );
}
