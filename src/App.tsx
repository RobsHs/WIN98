import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { FileSystemProvider } from './context/FileSystemContext';
import { WindowManagerProvider, useWindowManager } from './context/WindowManagerContext';
import { DesktopProvider } from './context/DesktopContext';
import { ContextMenuProvider } from './context/ContextMenuContext';
import { DialogProvider, useDialog } from './context/DialogContext';

import { Desktop } from './components/Desktop/Desktop';
import { Taskbar } from './components/Taskbar/Taskbar';
import { StartMenu } from './components/StartMenu/StartMenu';
import { WindowRenderer } from './components/Window/WindowRenderer';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { AltTabOverlay } from './components/AltTabOverlay/AltTabOverlay';
import { Screensaver } from './components/Screensaver/Screensaver';
import { BootSequence } from './components/BootSequence/BootSequence';

import { RunDialog } from './components/Dialogs/RunDialog';
import { ShutDownDialog } from './components/Dialogs/ShutDownDialog';
import { FindDialog } from './components/Dialogs/FindDialog';
import { MessageBoxContainer } from './components/Dialogs/MessageBox';
import { PropertiesDialogContainer } from './components/Dialogs/PropertiesDialog';
import { CommandPrompt } from './apps/CommandPrompt/CommandPrompt';
import { soundService } from './services/soundService';

const DesktopEnvironment: React.FC = () => {
  const { settings } = useSettings();
  const { openWindow, activeWindow, closeWindow } = useWindowManager();
  const { openRunDialog } = useDialog();

  const [isBooting, setIsBooting] = useState<boolean>(() => settings.showStartupBoot);
  const [isRestarting, setIsRestarting] = useState(false);
  const [isShutDown, setIsShutDown] = useState(false);
  const [isStandBy, setIsStandBy] = useState(false);
  const [isDosMode, setIsDosMode] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes Start Menu
      if (e.key === 'Escape') {
        setIsStartMenuOpen(false);
      }

      // Alt + F4 closes active window
      if (e.altKey && e.key === 'F4' && activeWindow) {
        e.preventDefault();
        soundService.playClick();
        closeWindow(activeWindow.id);
      }

      // Win + R or Alt + R opens Run
      if ((e.metaKey || e.altKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        soundService.playClick();
        openRunDialog();
      }

      // Win + E opens Explorer
      if (e.metaKey && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        soundService.playClick();
        openWindow('explorer');
      }

      // F1 opens Windows Help
      if (e.key === 'F1') {
        e.preventDefault();
        soundService.playClick();
        openWindow('windows-help');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWindow, closeWindow, openRunDialog, openWindow]);

  // Restart handler
  const handleRestart = () => {
    setIsShutDown(false);
    setIsDosMode(false);
    setIsRestarting(true);
    setIsBooting(true);
  };

  // Shut down screen
  if (isShutDown) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-center p-6 select-none font-sans">
        <div className="text-[#f97316] font-bold text-[28px] tracking-wide mb-4 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          It's now safe to turn off your computer.
        </div>
        <button
          onClick={handleRestart}
          className="text-gray-400 hover:text-white border border-gray-700 px-4 py-1 mt-6 text-[12px] bg-gray-900 cursor-pointer"
        >
          [ Restart Windows 98 ]
        </button>
      </div>
    );
  }

  // Standby screen
  if (isStandBy) {
    return (
      <div
        className="fixed inset-0 bg-black cursor-pointer flex items-center justify-center"
        onClick={() => setIsStandBy(false)}
      >
        <span className="text-gray-700 font-mono text-[11px] animate-pulse">
          Click anywhere or press any key to resume session...
        </span>
      </div>
    );
  }

  // Full Screen MS-DOS Mode
  if (isDosMode) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col p-4">
        <div className="flex justify-between items-center text-gray-500 border-b border-gray-800 pb-1 mb-2 text-[11px]">
          <span>MS-DOS Mode (Windows 98)</span>
          <button
            onClick={handleRestart}
            className="text-gray-400 hover:text-white border border-gray-700 px-2 py-0.5 bg-gray-900"
          >
            [ Return to Windows ]
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <CommandPrompt />
        </div>
      </div>
    );
  }

  // Boot sequence animation
  if (isBooting) {
    return (
      <BootSequence
        onComplete={() => {
          setIsBooting(false);
          setIsRestarting(false);
        }}
        isRestart={isRestarting}
      />
    );
  }

  // Calculate resolution container style if simulated resolution is selected
  let containerStyle: React.CSSProperties = { width: '100vw', height: '100vh' };
  if (settings.simulatedResolution === '640x480') {
    containerStyle = { width: '640px', height: '480px', margin: 'auto', position: 'relative', boxShadow: '0 0 40px rgba(0,0,0,0.8)' };
  } else if (settings.simulatedResolution === '800x600') {
    containerStyle = { width: '800px', height: '600px', margin: 'auto', position: 'relative', boxShadow: '0 0 40px rgba(0,0,0,0.8)' };
  } else if (settings.simulatedResolution === '1024x768') {
    containerStyle = { width: '1024px', height: '768px', margin: 'auto', position: 'relative', boxShadow: '0 0 40px rgba(0,0,0,0.8)' };
  } else if (settings.simulatedResolution === '1280x1024') {
    containerStyle = { width: '1280px', height: '1024px', margin: 'auto', position: 'relative', boxShadow: '0 0 40px rgba(0,0,0,0.8)' };
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none"
      onClick={() => setIsStartMenuOpen(false)}
    >
      <div className="relative overflow-hidden" style={containerStyle}>
        {/* Desktop Surface with Icons */}
        <Desktop />

        {/* Windows Manager Layer */}
        <WindowRenderer />

        {/* Taskbar & System Tray */}
        <Taskbar
          isStartMenuOpen={isStartMenuOpen}
          toggleStartMenu={() => setIsStartMenuOpen((prev) => !prev)}
          closeStartMenu={() => setIsStartMenuOpen(false)}
        />

        {/* Start Menu */}
        <StartMenu
          isOpen={isStartMenuOpen}
          onClose={() => setIsStartMenuOpen(false)}
        />

        {/* Global Context Menu */}
        <ContextMenu />

        {/* Interactive Alt+Tab Switcher HUD */}
        <AltTabOverlay />

        {/* Screensaver */}
        <Screensaver />

        {/* System Modal Dialogs */}
        <RunDialog />
        <ShutDownDialog
          onShutDown={() => setIsShutDown(true)}
          onRestart={handleRestart}
          onDosMode={() => setIsDosMode(true)}
          onStandBy={() => setIsStandBy(true)}
        />
        <FindDialog />
        <MessageBoxContainer />
        <PropertiesDialogContainer />
      </div>
    </div>
  );
};

export function App() {
  return (
    <SettingsProvider>
      <FileSystemProvider>
        <WindowManagerProvider>
          <DesktopProvider>
            <ContextMenuProvider>
              <DialogProvider>
                <DesktopEnvironment />
              </DialogProvider>
            </ContextMenuProvider>
          </DesktopProvider>
        </WindowManagerProvider>
      </FileSystemProvider>
    </SettingsProvider>
  );
}

export default App;
