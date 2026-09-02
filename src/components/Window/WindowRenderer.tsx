import React from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { Window } from './Window';
import { FileExplorer } from '../../apps/FileExplorer/FileExplorer';
import { MyComputer } from '../../apps/MyComputer/MyComputer';
import { RecycleBin } from '../../apps/RecycleBin/RecycleBin';
import { Notepad } from '../../apps/Notepad/Notepad';
import { Paint } from '../../apps/Paint/Paint';
import { Calculator } from '../../apps/Calculator/Calculator';
import { CommandPrompt } from '../../apps/CommandPrompt/CommandPrompt';
import { ControlPanel } from '../../apps/ControlPanel/ControlPanel';
import { DisplayProperties } from '../../apps/DisplayProperties/DisplayProperties';
import { DateTimeProperties } from '../../apps/DateTimeProperties/DateTimeProperties';
import { InternetExplorer } from '../../apps/InternetExplorer/InternetExplorer';
import { MediaPlayer } from '../../apps/MediaPlayer/MediaPlayer';
import { SystemInformation } from '../../apps/SystemInformation/SystemInformation';
import { WindowsHelp } from '../../apps/WindowsHelp/WindowsHelp';
import { Minesweeper } from '../../apps/Minesweeper/Minesweeper';

export const WindowRenderer: React.FC = () => {
  const { windows } = useWindowManager();

  const renderAppContent = (win: any) => {
    switch (win.appId) {
      case 'explorer':
        return <FileExplorer initialPath={win.customData?.path || 'C:'} />;
      case 'my-computer':
        return <MyComputer />;
      case 'recycle-bin':
        return <RecycleBin />;
      case 'notepad':
        return <Notepad filePath={win.customData?.filePath} windowId={win.id} />;
      case 'paint':
        return <Paint filePath={win.customData?.filePath} windowId={win.id} />;
      case 'calculator':
        return <Calculator />;
      case 'cmd':
        return <CommandPrompt windowId={win.id} />;
      case 'control-panel':
        return <ControlPanel />;
      case 'display-properties':
        return <DisplayProperties windowId={win.id} />;
      case 'date-time-properties':
        return <DateTimeProperties windowId={win.id} />;
      case 'browser':
        return <InternetExplorer initialUrl={win.customData?.url || 'about:home'} />;
      case 'media-player':
        return <MediaPlayer />;
      case 'system-info':
        return <SystemInformation />;
      case 'windows-help':
        return <WindowsHelp />;
      case 'minesweeper':
        return <Minesweeper />;
      default:
        return (
          <div className="p-4 text-center">
            Application '{win.appId}' is running.
          </div>
        );
    }
  };

  return (
    <>
      {windows.map((win) => (
        <Window key={win.id} window={win}>
          {renderAppContent(win)}
        </Window>
      ))}
    </>
  );
};

