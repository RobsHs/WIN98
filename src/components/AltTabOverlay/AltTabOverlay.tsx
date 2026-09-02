import React, { useState, useEffect } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { RetroIcon } from '../Icons/RetroIcons';
import { soundService } from '../../services/soundService';

export const AltTabOverlay: React.FC = () => {
  const { windows, restoreWindow } = useWindowManager();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let isAltDown = false;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        isAltDown = true;
      }
      if (e.key === 'Tab' && isAltDown && windows.length > 0) {
        e.preventDefault();
        soundService.playClick();
        if (!isOpen) {
          setIsOpen(true);
          setSelectedIndex(windows.length > 1 ? 1 : 0);
        } else {
          setSelectedIndex((prev) => (prev + 1) % windows.length);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') {
        isAltDown = false;
        if (isOpen && windows.length > 0) {
          const selectedWin = windows[selectedIndex];
          if (selectedWin) {
            restoreWindow(selectedWin.id);
          }
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, windows, selectedIndex, restoreWindow]);

  if (!isOpen || windows.length === 0) return null;

  const currentWindow = windows[selectedIndex];

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center pointer-events-none select-none">
      <div className="win-outset p-3 bg-[#c0c0c0] shadow-2xl flex flex-col items-center min-w-[340px] max-w-[500px]">
        {/* App Icons Row */}
        <div className="flex items-center space-x-3 p-3 bg-[#dfdfdf] win-inset w-full overflow-x-auto justify-center">
          {windows.map((win, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={win.id}
                className={`p-2 flex flex-col items-center justify-center cursor-default ${
                  isSelected ? 'win-inset bg-[#000080] text-white' : ''
                }`}
              >
                <RetroIcon name={win.icon || 'application'} size={32} />
              </div>
            );
          })}
        </div>

        {/* Selected Window Title */}
        <div className="mt-3 text-[12px] font-bold text-center tracking-tight truncate w-full px-2">
          {currentWindow?.title}
        </div>
      </div>
    </div>
  );
};

