import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDialog } from '../../context/DialogContext';
import { RetroIcon } from '../../components/Icons/RetroIcons';
import { soundService } from '../../services/soundService';

export const MyComputer: React.FC = () => {
  const { openWindow } = useWindowManager();
  const { showWarning, openPropertiesDialog } = useDialog();
  const [selectedItem, setSelectedItem] = useState<string | null>('drive-c');

  const items = [
    { id: 'drive-a', name: '3½ Floppy (A:)', icon: 'floppy', type: 'drive' },
    { id: 'drive-c', name: 'Local Disk (C:)', icon: 'hard-drive', type: 'drive', path: 'C:' },
    { id: 'drive-d', name: 'Compact Disc (D:)', icon: 'drive-c', type: 'drive' },
    { id: 'control-panel', name: 'Control Panel', icon: 'control-panel', type: 'system', appId: 'control-panel' },
    { id: 'printers', name: 'Printers', icon: 'system-info', type: 'system' },
    { id: 'dialup', name: 'Dial-Up Networking', icon: 'browser', type: 'system' },
  ];

  const handleOpenItem = (item: typeof items[0]) => {
    soundService.playClick();
    if (item.id === 'drive-c') {
      openWindow('explorer', { customData: { path: 'C:' } });
    } else if (item.appId) {
      openWindow(item.appId);
    } else if (item.id === 'drive-a') {
      showWarning('Device A: is not ready. Please ensure floppy disk is inserted.', '3½ Floppy (A:)');
    } else if (item.id === 'drive-d') {
      showWarning('Device D: is not ready. CD-ROM tray is empty.', 'Compact Disc (D:)');
    } else if (item.id === 'printers') {
      openWindow('explorer', { customData: { path: 'C:\\WINDOWS' } });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] overflow-hidden">
      {/* Menu Bar */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>F</u>ile</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>E</u>dit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>V</u>iew</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>H</u>elp</span>
      </div>

      {/* Main Grid View */}
      <div
        className="flex-1 win-inset bg-white p-3 overflow-y-auto"
        onClick={() => setSelectedItem(null)}
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(85px,1fr))] gap-3">
          {items.map((item) => {
            const isSelected = selectedItem === item.id;
            return (
              <div
                key={item.id}
                className={`flex flex-col items-center justify-start p-1.5 cursor-default text-center rounded-none select-none max-w-[95px] ${
                  isSelected ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(item.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  handleOpenItem(item);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  openPropertiesDialog({
                    title: `${item.name} Properties`,
                    targetType: 'system',
                    customData: { item },
                  });
                }}
              >
                <RetroIcon name={item.icon} size={32} />
                <span className="text-[11px] mt-1.5 break-words line-clamp-2 w-full px-0.5">
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5 min-w-[120px]">
          {items.length} object(s)
        </div>
        <div className="win-inset-shallow px-2 py-0.5 min-w-[150px]">
          Free Space: 7.84GB (Capacity: 8.40GB)
        </div>
        <div className="win-inset-shallow px-2 py-0.5 flex items-center space-x-1">
          <RetroIcon name="my-computer" size={12} />
          <span>My Computer</span>
        </div>
      </div>
    </div>
  );
};

