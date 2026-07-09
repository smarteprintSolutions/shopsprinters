'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin?: boolean;
  token: string;
  cart?: any[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isAdminLogin?: boolean) => Promise<any>;
  register: (userData: any) => Promise<any>;
  updateProfile: (userData: any) => Promise<any>;
  getOrders: () => Promise<any>;
  logout: () => void;
  sendRegistrationOTP: (userData: any) => Promise<any>;
  verifyRegistrationOTP: (email: string, otp: string) => Promise<any>;
  forgotPasswordRequest: (email: string) => Promise<any>;
  resetPasswordRequest: (email: string, otp: string, newPassword: string) => Promise<any>;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser?.data || parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, isAdminLogin = false) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password, isAdminLogin }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed');
      const userData = result.data || result;
      setUser(userData);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(userData));
      }
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', ...userData }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Registration failed');
      const registeredUser = result.data || result;
      setUser(registeredUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(registeredUser));
      }
      return registeredUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(userData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Update failed');
      const updatedProfile = result.data || result;
      const updatedUser = { ...user!, ...updatedProfile };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      }
      return updatedProfile;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || data.error || 'Failed to fetch orders');
      return data?.data?.orders || data?.orders || [];
    } catch (error) {
      throw error;
    }
  };

  const sendRegistrationOTP = async (userData: any) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-registration-otp', ...userData }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const verifyRegistrationOTP = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-registration-otp', email, otp }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'OTP verification failed');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const forgotPasswordRequest = async (email: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'forgot-password', email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send reset code');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const resetPasswordRequest = async (email: string, otp: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-password', email, otp, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Password reset failed');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userInfo');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateProfile, getOrders, logout, sendRegistrationOTP, verifyRegistrationOTP, forgotPasswordRequest, resetPasswordRequest, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
