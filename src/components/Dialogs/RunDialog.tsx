import React, { useState } from 'react';
import { useDialog } from '../../context/DialogContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { RetroIcon } from '../Icons/RetroIcons';
import { soundService } from '../../services/soundService';

export const RunDialog: React.FC = () => {
  const { isRunDialogOpen, closeRunDialog, showError } = useDialog();
  const { openWindow } = useWindowManager();
  const [command, setCommand] = useState('');

  if (!isRunDialogOpen) return null;

  const handleRun = () => {
    const cmd = command.trim().toLowerCase();
    if (!cmd) return;
    soundService.playClick();

    if (cmd === 'notepad' || cmd === 'notepad.exe') {
      openWindow('notepad');
    } else if (cmd === 'paint' || cmd === 'pbrush' || cmd === 'pbrush.exe') {
      openWindow('paint');
    } else if (cmd === 'calc' || cmd === 'calc.exe' || cmd === 'calculator') {
      openWindow('calculator');
    } else if (cmd === 'cmd' || cmd === 'command' || cmd === 'command.com') {
      openWindow('cmd');
    } else if (cmd === 'explorer' || cmd === 'explorer.exe') {
      openWindow('explorer');
    } else if (cmd === 'control' || cmd === 'control panel') {
      openWindow('control-panel');
    } else if (cmd === 'desk.cpl' || cmd === 'display') {
      openWindow('display-properties');
    } else if (cmd === 'timedate.cpl' || cmd === 'clock') {
      openWindow('date-time-properties');
    } else if (cmd === 'iexplore' || cmd === 'browser' || cmd.startsWith('http')) {
      openWindow('browser', { customData: { url: cmd.startsWith('http') ? cmd : 'about:home' } });
    } else if (cmd === 'mplayer' || cmd === 'media player') {
      openWindow('media-player');
    } else if (cmd === 'msinfo32' || cmd === 'system') {
      openWindow('system-info');
    } else if (cmd === 'winhelp' || cmd === 'help') {
      openWindow('windows-help');
    } else if (cmd === 'winmine' || cmd === 'minesweeper') {
      openWindow('minesweeper');
    } else if (cmd.startsWith('c:') || cmd.startsWith('\\')) {
      openWindow('explorer', { customData: { path: cmd } });
    } else {
      showError(`Cannot find the file '${command}' (or one of its components). Make sure the path and filename are correct and that all required libraries are available.`, 'Run');
      return;
    }
    closeRunDialog();
    setCommand('');
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-20 select-none"
      onClick={closeRunDialog}
    >
      <div
        className="win-outset w-[380px] p-1 bg-[#c0c0c0] shadow-2xl flex flex-col text-[11px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="win-titlebar active flex items-center justify-between mb-2">
          <span className="font-bold">Run</span>
          <button
            className="win-titlebar-btn"
            onClick={closeRunDialog}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col space-y-3">
          <div className="flex items-start space-x-3">
            <RetroIcon name="run" size={32} className="flex-shrink-0" />
            <p className="text-[11px] leading-relaxed">
              Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="run-input" className="font-bold">
              <u>O</u>pen:
            </label>
            <input
              id="run-input"
              type="text"
              autoFocus
              className="win-input flex-1 py-1 px-2 text-[11px]"
              value={command}
              placeholder="e.g. notepad, calc, paint, cmd, explorer"
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRun();
                if (e.key === 'Escape') closeRunDialog();
              }}
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end space-x-2 pt-2 border-t border-[#808080]">
            <button className="win-btn font-bold px-4" onClick={handleRun}>
              OK
            </button>
            <button className="win-btn px-4" onClick={closeRunDialog}>
              Cancel
            </button>
            <button
              className="win-btn px-3"
              onClick={() => {
                openWindow('explorer');
                closeRunDialog();
              }}
            >
              Browse...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

