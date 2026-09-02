import React, { useState } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { useContextMenu } from '../../context/ContextMenuContext';
import { useDialog } from '../../context/DialogContext';
import { RetroIcon } from '../../components/Icons/RetroIcons';
import type { DeletedItem } from '../../types/filesystem';
import type { ContextMenuItem } from '../../types/contextmenu';
import { soundService } from '../../services/soundService';

export const RecycleBin: React.FC = () => {
  const { fsState, restoreItem, emptyRecycleBin } = useFileSystem();
  const { showContextMenu } = useContextMenu();
  const { showConfirm, openPropertiesDialog } = useDialog();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const items = fsState.recycleBin || [];

  const handleEmpty = () => {
    if (items.length === 0) return;
    soundService.playClick();
    showConfirm(
      'Are you sure you want to permanently delete all items in the Recycle Bin?',
      () => emptyRecycleBin(),
      undefined,
      'Confirm Multiple File Delete'
    );
  };

  const handleRestore = (item: DeletedItem) => {
    soundService.playClick();
    restoreItem(item.id);
  };

  const handleItemContextMenu = (e: React.MouseEvent, item: DeletedItem) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItemId(item.id);

    const menuItems: ContextMenuItem[] = [
      {
        id: 'restore',
        label: 'Restore',
        action: () => handleRestore(item),
      },
      { id: 'sep1', isSeparator: true },
      {
        id: 'properties',
        label: 'Properties',
        action: () => {
          openPropertiesDialog({
            title: `${item.node.name} Properties`,
            targetType: 'file',
            targetId: item.node.id,
          });
        },
      },
    ];

    showContextMenu(e.clientX, e.clientY, menuItems);
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

      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-1 border-b border-[#808080] bg-[#c0c0c0]">
        <button
          className="win-btn px-3 h-[22px]"
          disabled={items.length === 0}
          onClick={handleEmpty}
        >
          Empty Recycle Bin
        </button>
        <button
          className="win-btn px-3 h-[22px]"
          disabled={!selectedItemId}
          onClick={() => {
            const item = items.find((i) => i.id === selectedItemId);
            if (item) handleRestore(item);
          }}
        >
          Restore Item
        </button>
      </div>

      {/* Main List */}
      <div
        className="flex-1 win-inset bg-white overflow-y-auto"
        onClick={() => setSelectedItemId(null)}
      >
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#dfdfdf] border-b border-[#808080]">
              <th className="p-1">Name</th>
              <th className="p-1">Original Location</th>
              <th className="p-1">Date Deleted</th>
              <th className="p-1">Size</th>
              <th className="p-1">Type</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <tr
                  key={item.id}
                  className={`cursor-default select-none ${
                    isSelected ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemId(item.id);
                  }}
                  onDoubleClick={() => handleRestore(item)}
                  onContextMenu={(e) => handleItemContextMenu(e, item)}
                >
                  <td className="p-1 flex items-center space-x-1.5">
                    <RetroIcon
                      name={item.node.type === 'folder' ? 'folder' : item.node.extension === 'bmp' ? 'paint' : 'notepad'}
                      size={16}
                    />
                    <span>{item.node.name}</span>
                  </td>
                  <td className="p-1 text-[10px]">{item.originalPath}</td>
                  <td className="p-1">{new Date(item.deletedAt).toLocaleString()}</td>
                  <td className="p-1">{item.node.size} bytes</td>
                  <td className="p-1 uppercase">{item.node.type === 'folder' ? 'Folder' : item.node.extension}</td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500 italic">
                  Recycle Bin is empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5 min-w-[120px]">
          {items.length} object(s)
        </div>
        <div className="win-inset-shallow px-2 py-0.5 flex items-center space-x-1">
          <RetroIcon name="recycle-bin-empty" size={12} />
          <span>Recycle Bin</span>
        </div>
      </div>
    </div>
  );
};

