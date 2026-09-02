import type { SystemSettings } from '../types/settings';
import type { DesktopIconItem } from '../types/desktop';

const SETTINGS_KEY = 'win98_system_settings';
const DESKTOP_ICONS_KEY = 'win98_desktop_icons';

export const defaultSettings: SystemSettings = {
  wallpaperTheme: 'teal',
  wallpaperMode: 'center',
  soundEnabled: true,
  screensaver: 'mystify',
  screensaverTimeoutMinutes: 5,
  colorScheme: 'classic',
  showStartupBoot: true,
  simulatedResolution: 'auto',
  volume: 80,
};

export const defaultDesktopIcons: DesktopIconItem[] = [
  { id: 'icon_my_computer', title: 'My Computer', icon: 'my-computer', appId: 'my-computer', gridX: 0, gridY: 0, isSystem: true },
  { id: 'icon_recycle_bin', title: 'Recycle Bin', icon: 'recycle-bin-empty', appId: 'recycle-bin', gridX: 0, gridY: 1, isSystem: true },
  { id: 'icon_my_docs', title: 'My Documents', icon: 'my-documents', appId: 'explorer', filePath: 'C:\\My Documents', gridX: 0, gridY: 2, isSystem: true },
  { id: 'icon_ie', title: 'Internet Explorer', icon: 'internet-explorer', appId: 'browser', gridX: 0, gridY: 3, isSystem: true },
  { id: 'icon_notepad', title: 'Notepad', icon: 'notepad', appId: 'notepad', gridX: 0, gridY: 4, isSystem: false },
  { id: 'icon_paint', title: 'Paint', icon: 'paint', appId: 'paint', gridX: 0, gridY: 5, isSystem: false },
  { id: 'icon_minesweeper', title: 'Minesweeper', icon: 'minesweeper', appId: 'minesweeper', gridX: 1, gridY: 0, isSystem: false },
  { id: 'icon_calc', title: 'Calculator', icon: 'calculator', appId: 'calculator', gridX: 1, gridY: 1, isSystem: false },
  { id: 'icon_cmd', title: 'MS-DOS Prompt', icon: 'cmd', appId: 'cmd', gridX: 1, gridY: 2, isSystem: false },
  { id: 'icon_media_player', title: 'Media Player', icon: 'media-player', appId: 'media-player', gridX: 1, gridY: 3, isSystem: false },
  { id: 'icon_control_panel', title: 'Control Panel', icon: 'control-panel', appId: 'control-panel', gridX: 1, gridY: 4, isSystem: true },
];

export const loadSystemSettings = (): SystemSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  return defaultSettings;
};

export const saveSystemSettings = (settings: SystemSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
};

export const loadDesktopIcons = (): DesktopIconItem[] => {
  try {
    const raw = localStorage.getItem(DESKTOP_ICONS_KEY);
    if (raw) {
      const items: DesktopIconItem[] = JSON.parse(raw);
      if (Array.isArray(items) && items.length > 0) {
        return items;
      }
    }
  } catch (e) {
    console.warn('Failed to load desktop icons', e);
  }
  return defaultDesktopIcons;
};

export const saveDesktopIcons = (icons: DesktopIconItem[]): void => {
  try {
    localStorage.setItem(DESKTOP_ICONS_KEY, JSON.stringify(icons));
  } catch (e) {
    console.warn('Failed to save desktop icons', e);
  }
};

