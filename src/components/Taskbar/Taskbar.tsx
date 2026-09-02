import React, { useState, useEffect, useRef } from 'react';
import { RetroIcon } from '../Icons/RetroIcons';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useSettings } from '../../context/SettingsContext';
import { soundService } from '../../services/soundService';

interface TaskbarProps {
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  isStartMenuOpen,
  toggleStartMenu,
}) => {
  const { windows, activeWindowId, toggleWindow, minimizeAll, openWindow } = useWindowManager();
  const { settings, setVolume, setSoundEnabled } = useSettings();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const volumePopupRef = useRef<HTMLDivElement>(null);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close volume popup when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (volumePopupRef.current && !volumePopupRef.current.contains(e.target as Node)) {
        setShowVolumePopup(false);
      }
    };
    if (showVolumePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVolumePopup]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-[28px] win-outset flex items-center justify-between px-1 z-[9990] bg-[#c0c0c0] select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Left side: Start Button + Quick Launch */}
      <div className="flex items-center space-x-1.5 h-full py-0.5">
        {/* Start Button */}
        <button
          className={`win-btn h-[22px] px-2 flex items-center space-x-1.5 font-bold ${
            isStartMenuOpen ? 'pressed' : ''
          }`}
          onClick={() => {
            soundService.playClick();
            toggleStartMenu();
          }}
        >
          <RetroIcon name="win98-logo" size={15} />
          <span className="text-[11px] font-bold font-sans">Start</span>
        </button>

        {/* Quick Launch Separator & Icons */}
        <div className="flex items-center space-x-1 px-1 border-l border-[#808080] border-r border-white h-[18px]">
          <button
            className="p-0.5 hover:win-outset-shallow active:win-inset-shallow"
            title="Show Desktop"
            onClick={() => {
              soundService.playClick();
              minimizeAll();
            }}
          >
            <RetroIcon name="display" size={15} />
          </button>
          <button
            className="p-0.5 hover:win-outset-shallow active:win-inset-shallow"
            title="Internet Explorer"
            onClick={() => {
              soundService.playClick();
              openWindow('browser');
            }}
          >
            <RetroIcon name="internet-explorer" size={15} />
          </button>
          <button
            className="p-0.5 hover:win-outset-shallow active:win-inset-shallow"
            title="Windows Explorer"
            onClick={() => {
              soundService.playClick();
              openWindow('explorer');
            }}
          >
            <RetroIcon name="folder-open" size={15} />
          </button>
        </div>

        {/* Running Windows Task Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto max-w-[calc(100vw-300px)] py-0.5">
          {windows.map((win) => {
            const isCurrent = win.id === activeWindowId && !win.isMinimized;
            return (
              <button
                key={win.id}
                className={`win-btn h-[22px] min-w-[120px] max-w-[160px] px-2 flex items-center justify-start space-x-1.5 truncate text-[11px] text-left ${
                  isCurrent ? 'pressed font-bold bg-[#dfdfdf]' : ''
                }`}
                onClick={() => {
                  soundService.playClick();
                  toggleWindow(win.id);
                }}
                title={win.title}
              >
                {win.icon && <RetroIcon name={win.icon} size={13} className="flex-shrink-0" />}
                <span className="truncate">{win.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right side: System Tray */}
      <div className="relative flex items-center space-x-2 win-inset-shallow px-2 py-0.5 h-[22px]">
        {/* Speaker / Volume Icon */}
        <button
          className="cursor-default flex items-center"
          title={`Volume: ${settings.volume}% (Click to adjust)`}
          onClick={() => setShowVolumePopup((prev) => !prev)}
        >
          <RetroIcon
            name={settings.soundEnabled && settings.volume > 0 ? 'sound' : 'sound'}
            size={14}
            className={!settings.soundEnabled ? 'opacity-40' : ''}
          />
        </button>

        {/* Real-time Clock */}
        <span
          className="text-[11px] font-sans tracking-tight cursor-default select-none"
          title={new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          onDoubleClick={() => {
            soundService.playClick();
            openWindow('date-time-properties');
          }}
        >
          {currentTime}
        </span>

        {/* Volume Popup Slider */}
        {showVolumePopup && (
          <div
            ref={volumePopupRef}
            className="absolute bottom-[26px] right-0 win-outset p-3 bg-[#c0c0c0] shadow-xl flex flex-col items-center select-none z-[9999]"
            style={{ width: '110px' }}
          >
            <div className="text-[11px] font-bold mb-2">Volume</div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-24 -rotate-90 my-6 w-20 cursor-pointer accent-[#000080]"
            />
            <label className="flex items-center space-x-1.5 text-[10px] mt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={!settings.soundEnabled}
                onChange={(e) => setSoundEnabled(!e.target.checked)}
              />
              <span>Mute</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

