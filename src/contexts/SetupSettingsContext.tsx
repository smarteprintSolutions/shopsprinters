'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export interface SetupSettings {
  showHeader: boolean;
  showLogo: boolean;
  allowModelSearch: boolean;
  allowInstallationFailed: boolean;
  allowCompleteSetup: boolean;
}

interface SetupSettingsContextType {
  settings: SetupSettings;
  loading: boolean;
  saving: boolean;
  refreshSettings: () => Promise<void>;
  updateSetting: (
    key: keyof SetupSettings,
    value: boolean
  ) => Promise<void>;
  updateSettings: (
    settings: Partial<SetupSettings>
  ) => Promise<void>;
}

const defaultSettings: SetupSettings = {
  showHeader: false,
  showLogo: true,
  allowModelSearch: true,
  allowInstallationFailed: false,
  allowCompleteSetup: false,
};

const SetupSettingsContext = createContext<
  SetupSettingsContextType | undefined
>(undefined);

export const useSetupSettings = () => {
  const context = useContext(SetupSettingsContext);

  if (!context) {
    throw new Error(
      'useSetupSettings must be used within SetupSettingsProvider'
    );
  }

  return context;
};

export const SetupSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [settings, setSettings] =
    useState<SetupSettings>(defaultSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refreshSettings = async () => {
    try {
      setLoading(true);

      const timestamp = Date.now();
      const res = await fetch(`/api/printer-setup/settings?_t=${timestamp}`, { cache: 'no-store' });

      if (!res.ok) throw new Error();

      const data = await res.json();

      setSettings({
        showHeader: data.showHeader ?? defaultSettings.showHeader,
        showLogo: data.showLogo ?? defaultSettings.showLogo,
        allowModelSearch: data.allowModelSearch ?? defaultSettings.allowModelSearch,
        allowInstallationFailed:
          data.allowInstallationFailed ?? defaultSettings.allowInstallationFailed,
        allowCompleteSetup:
          data.allowCompleteSetup ?? defaultSettings.allowCompleteSetup,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const updateSettings = async (
    updatedData: Partial<SetupSettings>
  ) => {
    const previous = settings;

    const updated = {
      ...settings,
      ...updatedData,
    };

    setSettings(updated);

    try {
      setSaving(true);

      const res = await fetch(
        '/api/printer-setup/settings',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updated),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();

      if (data.data) {
        setSettings({
          showHeader: data.data.showHeader,
          showLogo: data.data.showLogo,
          allowModelSearch: data.data.allowModelSearch,
          allowInstallationFailed:
            data.data.allowInstallationFailed,
          allowCompleteSetup:
            data.data.allowCompleteSetup,
        });
      }
    } catch (err) {
      console.error(err);

      setSettings(previous);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = async (
    key: keyof SetupSettings,
    value: boolean
  ) => {
    await updateSettings({
      [key]: value,
    });
  };

  return (
    <SetupSettingsContext.Provider
      value={{
        settings,
        loading,
        saving,
        refreshSettings,
        updateSetting,
        updateSettings,
      }}
    >
      {children}
    </SetupSettingsContext.Provider>
  );
};