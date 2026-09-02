import React, { useState, useEffect } from 'react';
import { RetroIcon } from '../Icons/RetroIcons';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDialog } from '../../context/DialogContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { soundService } from '../../services/soundService';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const { openWindow } = useWindowManager();
  const { openRunDialog, openShutDownDialog, openFindDialog, showConfirm, showInfo } = useDialog();
  const { fsState } = useFileSystem();

  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeSubSubmenu, setActiveSubSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setActiveSubmenu(null);
      setActiveSubSubmenu(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLaunch = (appId: string, customData?: any) => {
    soundService.playClick();
    openWindow(appId, { customData });
    onClose();
  };

  const handleOpenFile = (path: string) => {
    soundService.playClick();
    if (path.endsWith('.txt') || path.endsWith('.ini')) {
      openWindow('notepad', { customData: { filePath: path } });
    } else if (path.endsWith('.bmp') || path.endsWith('.png')) {
      openWindow('paint', { customData: { filePath: path } });
    } else {
      openWindow('explorer', { customData: { path } });
    }
    onClose();
  };

  return (
    <div
      className="fixed bottom-[28px] left-0 z-[9999] win-outset flex shadow-2xl bg-[#c0c0c0] select-none text-[11px]"
      style={{ width: '220px' }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Vertical Windows 98 Banner */}
      <div className="w-[30px] bg-gradient-to-t from-[#000080] via-[#1084d0] to-[#000080] flex flex-col justify-end items-center py-3 text-white">
        <span
          className="font-bold text-[14px] tracking-wider transform -rotate-90 whitespace-nowrap mb-6 select-none font-sans"
          style={{ textShadow: '1px 1px 2px #000' }}
        >
          <span className="font-extrabold text-white">Windows</span>
          <span className="font-light text-[#ffcc00] ml-1">98</span>
        </span>
      </div>

      {/* Main Menu Items Column */}
      <div className="flex-1 py-1 flex flex-col">
        {/* Programs */}
        <div
          className={`relative px-3 py-1.5 flex items-center justify-between cursor-default ${
            activeSubmenu === 'programs' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
          }`}
          onMouseEnter={() => {
            setActiveSubmenu('programs');
            setActiveSubSubmenu(null);
          }}
        >
          <div className="flex items-center space-x-2.5">
            <RetroIcon name="folder-open" size={20} />
            <span className="font-bold"><u>P</u>rograms</span>
          </div>
          <span className="text-[9px]">▶</span>

          {/* Programs Submenu */}
          {activeSubmenu === 'programs' && (
            <div
              className="absolute left-full -top-1 win-outset py-1 w-[200px] shadow-lg bg-[#c0c0c0] text-black"
              onMouseLeave={() => setActiveSubSubmenu(null)}
            >
              {/* Accessories */}
              <div
                className={`relative px-3 py-1.5 flex items-center justify-between cursor-default ${
                  activeSubSubmenu === 'accessories' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
                }`}
                onMouseEnter={() => setActiveSubSubmenu('accessories')}
              >
                <div className="flex items-center space-x-2">
                  <RetroIcon name="folder" size={16} />
                  <span>Accessories</span>
                </div>
                <span className="text-[9px]">▶</span>

                {/* Accessories Sub-Submenu */}
                {activeSubSubmenu === 'accessories' && (
                  <div className="absolute left-full -top-1 win-outset py-1 w-[180px] shadow-lg bg-[#c0c0c0] text-black">
                    <div
                      className="px-3 py-1 flex items-center space-x-2 hover:bg-[#000080] hover:text-white cursor-default"
                      onClick={() => handleLaunch('notepad')}
                    >
                      <RetroIcon name="notepad" size={16} />
                      <span>Notepad</span>
                    </div>
                    <div
                      className="px-3 py-1 flex items-center space-x-2 hover:bg-[#000080] hover:text-white cursor-default"
                      onClick={() => handleLaunch('paint')}
                    >
                      <RetroIcon name="paint" size={16} />
                      <span>Paint</span>
                    </div>
                    <div
                      className="px-3 py-1 flex items-center space-x-2 hover:bg-[#000080] hover:text-white cursor-default"
                      onClick={() => handleLaunch('calculator')}
                    >
                      <RetroIcon name="calculator" size={16} />
                      <span>Calculator</span>
                    </div>
                    <div
                      className="px-3 py-1 flex items-center space-x-2 hover:bg-[#000080] hover:text-white cursor-default"
                      onClick={() => handleLaunch('media-player')}
                    >
                      <RetroIcon name="media-player" size={16} />
                      <span>Windows Media Player</span>
                    </div>
                    <div className="my-1 border-t border-[#808080] border-b border-white" />
                    <div
                      className="px-3 py-1 flex items-center space-x-2 hover:bg-[#000080] hover:text-white cursor-default"
                      onClick={() => handleLaunch('system-info')}
                    >
                      <RetroIcon name="system-info" size={16} />
                      <span>System Information</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Games */}
              <div
                className={`relative px-3 py-1.5 flex items-center justify-between cursor-default ${
                  activeSubSubmenu === 'games' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
                }`}
                onMouseEnter={() => setActiveSubSubmenu('games')}
              >
                <div className="flex items-center space-x-2">
                  <RetroIcon name="folder" size={16} />
                  <span>Games</span>
                </div>
                <span className="text-[9px]">▶</span>

                {/* Games Sub-Submenu */}
                {activeSubSubmenu === 'games' && (
                  <div className="absolute left-full -top-1 win-outset py-1 w-[160px] shadow-lg bg-[#c0c0c0] text-black">
                    <div
                      className="px-3 py-1 flex items-center space-x-2 hover:bg-[#000080] hover:text-white cursor-default"
                      onClick={() => handleLaunch('minesweeper')}
                    >
                      <RetroIcon name="minesweeper" size={16} />
                      <span>Minesweeper</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="my-1 border-t border-[#808080] border-b border-white" />

              <div
                className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => handleLaunch('browser')}
              >
                <RetroIcon name="internet-explorer" size={16} />
                <span>Internet Explorer</span>
              </div>
              <div
                className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => handleLaunch('explorer')}
              >
                <RetroIcon name="folder-open" size={16} />
                <span>Windows Explorer</span>
              </div>
              <div
                className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => handleLaunch('cmd')}
              >
                <RetroIcon name="cmd" size={16} />
                <span>MS-DOS Prompt</span>
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        <div
          className={`relative px-3 py-1.5 flex items-center justify-between cursor-default ${
            activeSubmenu === 'documents' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
          }`}
          onMouseEnter={() => {
            setActiveSubmenu('documents');
            setActiveSubSubmenu(null);
          }}
        >
          <div className="flex items-center space-x-2.5">
            <RetroIcon name="my-documents" size={20} />
            <span><u>D</u>ocuments</span>
          </div>
          <span className="text-[9px]">▶</span>

          {activeSubmenu === 'documents' && (
            <div className="absolute left-full -top-1 win-outset py-1 w-[220px] shadow-lg bg-[#c0c0c0] text-black">
              {Object.values(fsState.nodes)
                .filter((n) => n.type === 'file' && !n.isSystem)
                .slice(0, 8)
                .map((file) => (
                  <div
                    key={file.id}
                    className="px-3 py-1 flex items-center space-x-2 hover:bg-[#000080] hover:text-white cursor-default truncate"
                    onClick={() => handleOpenFile(file.path)}
                  >
                    <RetroIcon name={file.extension === 'bmp' ? 'paint' : 'notepad'} size={16} />
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div
          className={`relative px-3 py-1.5 flex items-center justify-between cursor-default ${
            activeSubmenu === 'settings' ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
          }`}
          onMouseEnter={() => {
            setActiveSubmenu('settings');
            setActiveSubSubmenu(null);
          }}
        >
          <div className="flex items-center space-x-2.5">
            <RetroIcon name="control-panel" size={20} />
            <span><u>S</u>ettings</span>
          </div>
          <span className="text-[9px]">▶</span>

          {activeSubmenu === 'settings' && (
            <div className="absolute left-full -top-1 win-outset py-1 w-[200px] shadow-lg bg-[#c0c0c0] text-black">
              <div
                className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => handleLaunch('control-panel')}
              >
                <RetroIcon name="control-panel" size={16} />
                <span>Control Panel</span>
              </div>
              <div
                className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => handleLaunch('display-properties')}
              >
                <RetroIcon name="display" size={16} />
                <span>Display...</span>
              </div>
              <div
                className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => handleLaunch('date-time-properties')}
              >
                <RetroIcon name="date-time" size={16} />
                <span>Taskbar &amp; Date/Time...</span>
              </div>
            </div>
          )}
        </div>

        {/* Find */}
        <div
          className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => {
            soundService.playClick();
            openFindDialog();
            onClose();
          }}
        >
          <RetroIcon name="find" size={20} />
          <span><u>F</u>ind</span>
        </div>

        {/* Help */}
        <div
          className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => handleLaunch('windows-help')}
        >
          <RetroIcon name="help" size={20} />
          <span><u>H</u>elp</span>
        </div>

        {/* Run */}
        <div
          className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => {
            soundService.playClick();
            openRunDialog();
            onClose();
          }}
        >
          <RetroIcon name="run" size={20} />
          <span><u>R</u>un...</span>
        </div>

        {/* Separator */}
        <div className="my-1 border-t border-[#808080] border-b border-white" />

        {/* Log Off */}
        <div
          className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => {
            soundService.playClick();
            onClose();
            showConfirm(
              'Are you sure you want to log off?',
              () => {
                showInfo('Logged off user session. Welcome back!', 'Windows 98');
              },
              undefined,
              'Log Off Windows'
            );
          }}
        >
          <RetroIcon name="log-off" size={20} />
          <span><u>L</u>og Off User...</span>
        </div>

        {/* Shut Down */}
        <div
          className="px-3 py-1.5 flex items-center space-x-2.5 hover:bg-[#000080] hover:text-white cursor-default"
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => {
            soundService.playClick();
            openShutDownDialog();
            onClose();
          }}
        >
          <RetroIcon name="shut-down" size={20} />
          <span>Sh<u>u</u>t Down...</span>
        </div>
      </div>
    </div>
  );
};

