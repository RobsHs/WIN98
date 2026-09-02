import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDialog } from '../../context/DialogContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { useSettings } from '../../context/SettingsContext';
import { useDesktop } from '../../context/DesktopContext';
import { RetroIcon } from '../../components/Icons/RetroIcons';
import { soundService } from '../../services/soundService';

export const ControlPanel: React.FC = () => {
  const { openWindow } = useWindowManager();
  const { showInfo, showConfirm } = useDialog();
  const { resetFileSystem } = useFileSystem();
  const { resetSettings } = useSettings();
  const { resetDesktopIcons } = useDesktop();

  const [selectedApplet, setSelectedApplet] = useState<string | null>('display');

  const applets = [
    {
      id: 'display',
      name: 'Display',
      icon: 'display',
      description: 'Changes desktop wallpaper, screen saver, appearance colors, and settings.',
      action: () => openWindow('display-properties'),
    },
    {
      id: 'date-time',
      name: 'Date/Time',
      icon: 'date-time',
      description: 'Sets the computer date and time.',
      action: () => openWindow('date-time-properties'),
    },
    {
      id: 'sound',
      name: 'Sounds',
      icon: 'sound',
      description: 'Changes sound effects and volume.',
      action: () => showInfo('Use the Taskbar Tray speaker icon or Display Properties to configure sounds.', 'Sounds'),
    },
    {
      id: 'system',
      name: 'System',
      icon: 'system-info',
      description: 'Provides information about your system hardware and environment.',
      action: () => openWindow('system-info'),
    },
    {
      id: 'mouse',
      name: 'Mouse',
      icon: 'control-panel',
      description: 'Adjusts mouse button configuration and pointer speed.',
      action: () => showInfo('Mouse pointer speed is set to optimal hardware tracking.', 'Mouse Properties'),
    },
    {
      id: 'keyboard',
      name: 'Keyboard',
      icon: 'control-panel',
      description: 'Adjusts keyboard repeat rate and delay.',
      action: () => showInfo('Keyboard repeat delay: Short\nRepeat rate: Fast', 'Keyboard Properties'),
    },
    {
      id: 'internet',
      name: 'Internet Options',
      icon: 'browser',
      description: 'Configures Internet Explorer browser options and homepage.',
      action: () => openWindow('browser', { customData: { url: 'about:home' } }),
    },
    {
      id: 'reset',
      name: 'Restore Default Settings',
      icon: 'shut-down',
      description: 'Restores the virtual filesystem, desktop icons, and settings to original state.',
      action: () => {
        showConfirm(
          'Restore Default Settings?\n\nThis will remove your virtual files and restore the desktop to its initial state.',
          () => {
            resetFileSystem();
            resetSettings();
            resetDesktopIcons();
            showInfo('Default settings and filesystem have been restored.', 'System Restored');
          },
          undefined,
          'Restore Default Settings'
        );
      },
    },
  ];

  const currentApplet = applets.find((a) => a.id === selectedApplet) || applets[0];

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] overflow-hidden">
      {/* Menu Bar */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>F</u>ile</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>E</u>dit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>V</u>iew</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>H</u>elp</span>
      </div>

      {/* Main Container: Left Description Box + Right Applets Grid */}
      <div className="flex-1 flex overflow-hidden win-inset bg-white p-2">
        {/* Left Side Info Pane */}
        <div className="w-[180px] p-3 border-r border-[#808080] flex flex-col items-center text-center bg-[#f0f0f0]">
          <RetroIcon name="control-panel" size={48} />
          <span className="font-bold text-[13px] mt-2 text-[#000080]">Control Panel</span>
          <p className="text-[11px] text-gray-600 mt-2 leading-relaxed text-left">
            Use the settings in Control Panel to personalize your computer.
          </p>
          <div className="mt-4 pt-3 border-t border-[#808080] w-full text-left">
            <span className="font-bold text-[#000080]">{currentApplet.name}</span>
            <p className="text-[10px] text-gray-700 mt-1">{currentApplet.description}</p>
          </div>
        </div>

        {/* Right Grid */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(85px,1fr))] gap-3">
            {applets.map((applet) => {
              const isSelected = selectedApplet === applet.id;
              return (
                <div
                  key={applet.id}
                  className={`flex flex-col items-center justify-start p-1.5 cursor-default text-center rounded-none select-none max-w-[95px] ${
                    isSelected ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedApplet(applet.id)}
                  onDoubleClick={() => {
                    soundService.playClick();
                    applet.action();
                  }}
                >
                  <RetroIcon name={applet.icon} size={32} />
                  <span className="text-[11px] mt-1.5 break-words line-clamp-2 w-full px-0.5">
                    {applet.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5 min-w-[120px]">
          {applets.length} object(s)
        </div>
        <div className="win-inset-shallow px-2 py-0.5 flex items-center space-x-1">
          <RetroIcon name="my-computer" size={12} />
          <span>My Computer</span>
        </div>
      </div>
    </div>
  );
};

