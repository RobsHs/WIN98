import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SystemSettings, WallpaperTheme, WallpaperMode, ScreensaverType, ColorScheme } from '../types/settings';
import { loadSystemSettings, saveSystemSettings, defaultSettings } from '../services/storageService';
import { soundService } from '../services/soundService';

interface SettingsContextType {
  settings: SystemSettings;
  updateSettings: (partial: Partial<SystemSettings>) => void;
  setWallpaper: (theme: WallpaperTheme, mode?: WallpaperMode, customUrl?: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
  setScreensaver: (screensaver: ScreensaverType) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  setSimulatedResolution: (res: SystemSettings['simulatedResolution']) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings>(loadSystemSettings);

  useEffect(() => {
    saveSystemSettings(settings);
    soundService.setSoundEnabled(settings.soundEnabled);
    soundService.setVolume(settings.volume);
  }, [settings]);

  const updateSettings = (partial: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const setWallpaper = (theme: WallpaperTheme, mode?: WallpaperMode, customUrl?: string) => {
    setSettings((prev) => ({
      ...prev,
      wallpaperTheme: theme,
      wallpaperMode: mode || prev.wallpaperMode,
      customWallpaperUrl: customUrl !== undefined ? customUrl : prev.customWallpaperUrl,
    }));
  };

  const setSoundEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, soundEnabled: enabled }));
  };

  const setVolume = (volume: number) => {
    setSettings((prev) => ({ ...prev, volume }));
  };

  const setScreensaver = (screensaver: ScreensaverType) => {
    setSettings((prev) => ({ ...prev, screensaver }));
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setSettings((prev) => ({ ...prev, colorScheme: scheme }));
  };

  const setSimulatedResolution = (res: SystemSettings['simulatedResolution']) => {
    setSettings((prev) => ({ ...prev, simulatedResolution: res }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        setWallpaper,
        setSoundEnabled,
        setVolume,
        setScreensaver,
        setColorScheme,
        setSimulatedResolution,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

