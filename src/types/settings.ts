export type WallpaperMode = 'center' | 'tile' | 'stretch';
export type WallpaperTheme = 'teal' | 'clouds' | 'blue' | 'matrix' | 'sunset' | 'classic95' | 'custom';
export type ScreensaverType = 'none' | 'mystify' | 'starfield' | '3dtext' | 'blank';
export type ColorScheme = 'classic' | 'highContrast' | 'desert' | 'rainyDay' | 'rose';

export interface SystemSettings {
  wallpaperTheme: WallpaperTheme;
  wallpaperMode: WallpaperMode;
  customWallpaperUrl?: string;
  soundEnabled: boolean;
  screensaver: ScreensaverType;
  screensaverTimeoutMinutes: number;
  colorScheme: ColorScheme;
  showStartupBoot: boolean;
  simulatedResolution: 'auto' | '640x480' | '800x600' | '1024x768' | '1280x1024';
  volume: number; // 0 to 100
}

