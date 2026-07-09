"use client";
import React, { useEffect, useState } from 'react';
import SettingsManagement from './SettingsManagement';
import SimpleAdminLogin from './SimpleAdminLogin';

export default function SettingsManagementWrapper() {
  const [showHeader, setShowHeader] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [allowModelSearch, setAllowModelSearch] = useState(true);
  const [allowInstallationFailed, setAllowInstallationFailed] = useState(true);
  const [allowCompleteSetup, setAllowCompleteSetup] = useState(true);
  const [adminStatus, setAdminStatus] = useState<string | null>(null);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchSettings() {
      try {
        const res = await fetch('/api/setup/header-visibility');
        if (!res.ok) {
          setAdminStatus('Failed to load settings');
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setShowHeader(data.showHeader !== false);
        setShowLogo(data.showLogo !== false);
        setAllowModelSearch(data.allowModelSearch !== false);
        setAllowInstallationFailed(data.allowInstallationFailed !== false);
        setAllowCompleteSetup(data.allowCompleteSetup !== false);
      } catch (err) {
        if (!mounted) return;
        setAdminStatus('Failed to load settings');
      }
    }
    fetchSettings();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    // load local admin info token if present
    const stored = typeof window !== 'undefined' ? localStorage.getItem('setupAdminInfo') : null;
    if (stored) {
      try { setAdminInfo(JSON.parse(stored)); } catch { }
    }
  }, []);

  const handleLogin = async (username: string, password: string) => {
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setLoginError('Invalid credentials');
        return;
      }
      const data = await res.json();
      setAdminInfo(data);
      localStorage.setItem('setupAdminInfo', JSON.stringify(data));
    } catch (err) {
      setLoginError('Login failed');
    }
  };

  if (!adminInfo) {
    return <SimpleAdminLogin onLogin={handleLogin} error={loginError || undefined} />;
  }

  return (
    <SettingsManagement
      showLogo={showLogo}
      setShowLogo={(val: boolean) => updateSetting('showLogo', val)}
      showHeader={showHeader}
      setShowHeader={(val: boolean) => updateSetting('showHeader', val)}
      allowModelSearch={allowModelSearch}
      setAllowModelSearch={(val: boolean) => updateSetting('allowModelSearch', val)}
      allowInstallationFailed={allowInstallationFailed}
      setAllowInstallationFailed={(val: boolean) => updateSetting('allowInstallationFailed', val)}
      allowCompleteSetup={allowCompleteSetup}
      setAllowCompleteSetup={(val: boolean) => updateSetting('allowCompleteSetup', val)}
      adminStatus={adminStatus}
    />
  );

  async function updateSetting(key: string, value: boolean) {
    setAdminStatus('');
    // optimistic update
    switch (key) {
      case 'showHeader': setShowHeader(value); break;
      case 'showLogo': setShowLogo(value); break;
      case 'allowModelSearch': setAllowModelSearch(value); break;
      case 'allowInstallationFailed': setAllowInstallationFailed(value); break;
      case 'allowCompleteSetup': setAllowCompleteSetup(value); break;
    }

    try {
      const res = await fetch('/api/setup/header-visibility', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      if (!res.ok) throw new Error('Failed to save');
      setAdminStatus('Settings updated successfully.');
      setTimeout(() => setAdminStatus(''), 3000);
    } catch (err: any) {
      setAdminStatus(err?.message || 'Failed to save settings');
    }
  }
}
