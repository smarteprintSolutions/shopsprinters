'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const { sendRegistrationOTP, verifyRegistrationOTP, loading } = useAuth();
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await sendRegistrationOTP(formData);
      setSuccess('OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await verifyRegistrationOTP(formData.email, otp);
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-dark mb-8 text-center">
          {step === 'details' ? 'Create Account' : 'Verify Email'}
        </h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-6">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-2xl mb-6">
            {success}
          </div>
        )}
        
        {step === 'details' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">First Name</label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#024AD8] transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-2">Last Name</label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#024AD8] transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#024AD8] transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#024AD8] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#024AD8] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#024AD8] hover:bg-[#01369e] text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-[#024AD8] transition-colors text-center text-2xl tracking-widest"
                placeholder="123456"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                Enter the 6-digit code sent to {formData.email}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#024AD8] hover:bg-[#01369e] text-white font-semibold py-3 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <button
              type="button"
              onClick={() => setStep('details')}
              className="w-full text-gray-600 hover:text-gray-800 font-medium py-2"
            >
              Back
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-[#024AD8] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
