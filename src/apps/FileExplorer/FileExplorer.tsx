import React, { useState, useEffect } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useContextMenu } from '../../context/ContextMenuContext';
import { useDialog } from '../../context/DialogContext';
import { RetroIcon } from '../../components/Icons/RetroIcons';
import type { VFSNode } from '../../types/filesystem';
import type { ContextMenuItem } from '../../types/contextmenu';
import { soundService } from '../../services/soundService';

interface FileExplorerProps {
  initialPath?: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ initialPath = 'C:' }) => {
  const {
    fsState,
    getNodeByPath,
    getChildren,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    copyNode,
    moveNode,
  } = useFileSystem();

  const { openWindow } = useWindowManager();
  const { showContextMenu } = useContextMenu();
  const { openPropertiesDialog, showConfirm, showInfo } = useDialog();

  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [history, setHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [addressInput, setAddressInput] = useState<string>(initialPath);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'icons' | 'list' | 'details'>('icons');
  const [clipboard, setClipboard] = useState<{ nodeId: string; isCut: boolean } | null>(null);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Current folder node
  const currentNode = getNodeByPath(currentPath) || getNodeByPath('C:');
  const items = currentNode ? getChildren(currentNode.id) : [];

  useEffect(() => {
    setAddressInput(currentPath);
    setSelectedItemIds([]);
  }, [currentPath]);

  const navigateTo = (newPath: string) => {
    const node = getNodeByPath(newPath);
    if (!node || node.type !== 'folder') return;
    soundService.playClick();
    const cleanPath = node.path;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(cleanPath);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(cleanPath);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      soundService.playClick();
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setCurrentPath(history[prev]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      soundService.playClick();
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setCurrentPath(history[next]);
    }
  };

  const handleUp = () => {
    if (currentNode && currentNode.parentId) {
      const parent = fsState.nodes[currentNode.parentId];
      if (parent) {
        navigateTo(parent.path);
      }
    }
  };

  const handleOpenItem = (item: VFSNode) => {
    soundService.playClick();
    if (item.type === 'folder') {
      navigateTo(item.path);
    } else {
      if (item.extension === 'txt' || item.extension === 'ini' || item.extension === 'sys') {
        openWindow('notepad', { customData: { filePath: item.path } });
      } else if (item.extension === 'bmp' || item.extension === 'png') {
        openWindow('paint', { customData: { filePath: item.path } });
      } else if (item.extension === 'htm' || item.extension === 'html') {
        openWindow('browser', { customData: { url: item.path } });
      } else if (item.extension === 'exe' || item.extension === 'com') {
        if (item.name.toUpperCase() === 'NOTEPAD.EXE') openWindow('notepad');
        else if (item.name.toUpperCase() === 'PBRUSH.EXE') openWindow('paint');
        else if (item.name.toUpperCase() === 'CALC.EXE') openWindow('calculator');
        else if (item.name.toUpperCase() === 'COMMAND.COM') openWindow('cmd');
        else showInfo(`Application executed: ${item.name}`, 'Application');
      } else {
        openWindow('notepad', { customData: { filePath: item.path } });
      }
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const node = getNodeByPath(addressInput);
    if (node && node.type === 'folder') {
      navigateTo(node.path);
    } else {
      soundService.playExclamation();
    }
  };

  const handleItemContextMenu = (e: React.MouseEvent, item: VFSNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItemIds([item.id]);

    const menuItems: ContextMenuItem[] = [
      {
        id: 'open',
        label: 'Open',
        action: () => handleOpenItem(item),
      },
    ];

    if (!item.isSystem) {
      menuItems.push(
        {
          id: 'cut',
          label: 'Cut',
          action: () => setClipboard({ nodeId: item.id, isCut: true }),
        },
        {
          id: 'copy',
          label: 'Copy',
          action: () => setClipboard({ nodeId: item.id, isCut: false }),
        },
        { id: 'sep1', isSeparator: true },
        {
          id: 'rename',
          label: 'Rename',
          action: () => {
            setRenamingId(item.id);
            setRenameValue(item.name);
          },
        },
        {
          id: 'delete',
          label: 'Delete',
          action: () => {
            showConfirm(
              `Are you sure you want to send '${item.name}' to the Recycle Bin?`,
              () => deleteNode(item.id),
              undefined,
              'Confirm File Delete'
            );
          },
        }
      );
    }

    menuItems.push(
      { id: 'sep2', isSeparator: true },
      {
        id: 'properties',
        label: 'Properties',
        action: () => {
          openPropertiesDialog({
            title: `${item.name} Properties`,
            targetType: item.type,
            targetId: item.id,
          });
        },
      }
    );

    showContextMenu(e.clientX, e.clientY, menuItems);
  };

  const handleAreaContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const menuItems: ContextMenuItem[] = [
      {
        id: 'view',
        label: 'View',
        subItems: [
          { id: 'v-icons', label: 'Large Icons', checked: viewMode === 'icons', action: () => setViewMode('icons') },
          { id: 'v-list', label: 'List', checked: viewMode === 'list', action: () => setViewMode('list') },
          { id: 'v-details', label: 'Details', checked: viewMode === 'details', action: () => setViewMode('details') },
        ],
      },
      {
        id: 'refresh',
        label: 'Refresh',
        action: () => soundService.playClick(),
      },
      { id: 'sep1', isSeparator: true },
      {
        id: 'paste',
        label: 'Paste',
        disabled: !clipboard,
        action: () => {
          if (clipboard && currentNode) {
            if (clipboard.isCut) {
              moveNode(clipboard.nodeId, currentNode.id);
              setClipboard(null);
            } else {
              copyNode(clipboard.nodeId, currentNode.id);
            }
          }
        },
      },
      { id: 'sep2', isSeparator: true },
      {
        id: 'new',
        label: 'New',
        subItems: [
          {
            id: 'new-folder',
            label: 'Folder',
            icon: 'folder',
            action: () => {
              if (currentNode) createFolder(currentNode.id, 'New Folder');
            },
          },
          {
            id: 'new-txt',
            label: 'Text Document',
            icon: 'notepad',
            action: () => {
              if (currentNode) createFile(currentNode.id, 'New Text Document.txt', '', 'txt');
            },
          },
          {
            id: 'new-bmp',
            label: 'Bitmap Image',
            icon: 'paint',
            action: () => {
              if (currentNode) createFile(currentNode.id, 'New Bitmap Image.bmp', '', 'bmp');
            },
          },
        ],
      },
      { id: 'sep3', isSeparator: true },
      {
        id: 'properties',
        label: 'Properties',
        action: () => {
          if (currentNode) {
            openPropertiesDialog({
              title: `${currentNode.name} Properties`,
              targetType: 'folder',
              targetId: currentNode.id,
            });
          }
        },
      },
    ];

    showContextMenu(e.clientX, e.clientY, menuItems);
  };

  const handleRenameSubmit = (nodeId: string) => {
    if (renameValue.trim()) {
      renameNode(nodeId, renameValue.trim());
    }
    setRenamingId(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] overflow-hidden">
      {/* Menu Bar */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>F</u>ile</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>E</u>dit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>V</u>iew</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>G</u>o</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>H</u>elp</span>
      </div>

      {/* Navigation Toolbar */}
      <div className="flex items-center space-x-1 p-1 border-b border-[#808080] bg-[#c0c0c0]">
        <button
          className="win-btn px-2 h-[22px] min-w-[24px] flex items-center space-x-1"
          disabled={historyIndex <= 0}
          onClick={handleBack}
          title="Back"
        >
          <span>←</span>
          <span className="text-[10px]">Back</span>
        </button>
        <button
          className="win-btn px-2 h-[22px] min-w-[24px] flex items-center space-x-1"
          disabled={historyIndex >= history.length - 1}
          onClick={handleForward}
          title="Forward"
        >
          <span>→</span>
          <span className="text-[10px]">Forward</span>
        </button>
        <button
          className="win-btn px-2 h-[22px] min-w-[24px]"
          disabled={!currentNode || !currentNode.parentId}
          onClick={handleUp}
          title="Up One Level"
        >
          ↑ Up
        </button>

        <div className="h-[18px] border-l border-[#808080] border-r border-white mx-1" />

        <button
          className="win-btn px-2 h-[22px]"
          onClick={() => {
            if (selectedItemIds.length > 0) {
              setClipboard({ nodeId: selectedItemIds[0], isCut: true });
            }
          }}
          disabled={selectedItemIds.length === 0}
          title="Cut"
        >
          Cut
        </button>
        <button
          className="win-btn px-2 h-[22px]"
          onClick={() => {
            if (selectedItemIds.length > 0) {
              setClipboard({ nodeId: selectedItemIds[0], isCut: false });
            }
          }}
          disabled={selectedItemIds.length === 0}
          title="Copy"
        >
          Copy
        </button>
        <button
          className="win-btn px-2 h-[22px]"
          onClick={() => {
            if (clipboard && currentNode) {
              if (clipboard.isCut) {
                moveNode(clipboard.nodeId, currentNode.id);
                setClipboard(null);
              } else {
                copyNode(clipboard.nodeId, currentNode.id);
              }
            }
          }}
          disabled={!clipboard}
          title="Paste"
        >
          Paste
        </button>

        <div className="h-[18px] border-l border-[#808080] border-r border-white mx-1" />

        <button
          className="win-btn px-2 h-[22px]"
          onClick={() => {
            if (selectedItemIds.length > 0) {
              const node = fsState.nodes[selectedItemIds[0]];
              if (node) {
                showConfirm(
                  `Are you sure you want to delete '${node.name}'?`,
                  () => deleteNode(node.id),
                  undefined,
                  'Confirm File Delete'
                );
              }
            }
          }}
          disabled={selectedItemIds.length === 0}
          title="Delete"
        >
          Delete
        </button>

        <button
          className="win-btn px-2 h-[22px]"
          onClick={() => {
            if (selectedItemIds.length > 0) {
              const node = fsState.nodes[selectedItemIds[0]];
              if (node) {
                openPropertiesDialog({
                  title: `${node.name} Properties`,
                  targetType: node.type,
                  targetId: node.id,
                });
              }
            }
          }}
          disabled={selectedItemIds.length === 0}
          title="Properties"
        >
          Properties
        </button>

        <div className="flex-1" />

        {/* View Mode Buttons */}
        <div className="flex items-center space-x-0.5">
          <button
            className={`win-btn px-1.5 h-[20px] min-w-[20px] ${viewMode === 'icons' ? 'pressed' : ''}`}
            onClick={() => setViewMode('icons')}
            title="Large Icons"
          >
            ⊞
          </button>
          <button
            className={`win-btn px-1.5 h-[20px] min-w-[20px] ${viewMode === 'list' ? 'pressed' : ''}`}
            onClick={() => setViewMode('list')}
            title="List"
          >
            ☰
          </button>
          <button
            className={`win-btn px-1.5 h-[20px] min-w-[20px] ${viewMode === 'details' ? 'pressed' : ''}`}
            onClick={() => setViewMode('details')}
            title="Details"
          >
            ▤
          </button>
        </div>
      </div>

      {/* Address Bar */}
      <form onSubmit={handleAddressSubmit} className="flex items-center space-x-2 px-2 py-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="font-sans text-[#404040] font-bold text-[11px]">Address</span>
        <div className="flex-1 flex items-center">
          <input
            type="text"
            className="win-input flex-1 py-0.5 px-2 text-[11px]"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
          />
        </div>
        <button type="submit" className="win-btn h-[20px] px-2 text-[10px]">
          Go
        </button>
      </form>

      {/* Main Content Area */}
      <div
        className="flex-1 win-inset bg-white overflow-y-auto p-2"
        onClick={() => setSelectedItemIds([])}
        onContextMenu={handleAreaContextMenu}
      >
        {viewMode === 'icons' ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2">
            {items.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              const isRenaming = renamingId === item.id;
              const iconName = item.type === 'folder' ? 'folder' : item.extension === 'bmp' ? 'paint' : 'notepad';

              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center justify-start p-1 cursor-default text-center rounded-none select-none max-w-[85px] ${
                    isSelected ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemIds([item.id]);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleOpenItem(item);
                  }}
                  onContextMenu={(e) => handleItemContextMenu(e, item)}
                >
                  <RetroIcon name={iconName} size={32} />
                  {isRenaming ? (
                    <input
                      type="text"
                      autoFocus
                      className="win-input text-[10px] text-center w-full py-0 px-1 mt-1 text-black"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSubmit(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSubmit(item.id);
                        if (e.key === 'Escape') setRenamingId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="text-[11px] mt-1 break-words line-clamp-2 w-full px-0.5">
                      {item.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : viewMode === 'list' ? (
          <div className="flex flex-col space-y-1">
            {items.map((item) => {
              const isSelected = selectedItemIds.includes(item.id);
              const iconName = item.type === 'folder' ? 'folder' : item.extension === 'bmp' ? 'paint' : 'notepad';
              return (
                <div
                  key={item.id}
                  className={`flex items-center space-x-2 px-2 py-0.5 cursor-default select-none ${
                    isSelected ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemIds([item.id]);
                  }}
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleOpenItem(item);
                  }}
                  onContextMenu={(e) => handleItemContextMenu(e, item)}
                >
                  <RetroIcon name={iconName} size={16} />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#dfdfdf] border-b border-[#808080]">
                <th className="p-1">Name</th>
                <th className="p-1">Size</th>
                <th className="p-1">Type</th>
                <th className="p-1">Modified</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const iconName = item.type === 'folder' ? 'folder' : item.extension === 'bmp' ? 'paint' : 'notepad';
                return (
                  <tr
                    key={item.id}
                    className={`cursor-default select-none ${
                      isSelected ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItemIds([item.id]);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      handleOpenItem(item);
                    }}
                    onContextMenu={(e) => handleItemContextMenu(e, item)}
                  >
                    <td className="p-1 flex items-center space-x-1.5">
                      <RetroIcon name={iconName} size={16} />
                      <span>{item.name}</span>
                    </td>
                    <td className="p-1">{item.type === 'file' ? `${item.size} bytes` : ''}</td>
                    <td className="p-1 uppercase">{item.type === 'folder' ? 'File Folder' : `${item.extension || 'TXT'} Document`}</td>
                    <td className="p-1">{new Date(item.modifiedAt).toLocaleDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5 min-w-[120px]">
          {items.length} object(s)
        </div>
        <div className="win-inset-shallow px-2 py-0.5 min-w-[120px]">
          {selectedItemIds.length > 0 ? `${selectedItemIds.length} item(s) selected` : `${items.reduce((acc, i) => acc + i.size, 0)} bytes`}
        </div>
        <div className="win-inset-shallow px-2 py-0.5 flex items-center space-x-1">
          <RetroIcon name="my-computer" size={12} />
          <span>My Computer</span>
        </div>
      </div>
    </div>
  );
};

