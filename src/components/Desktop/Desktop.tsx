import React, { useState, useRef, useEffect } from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useContextMenu } from '../../context/ContextMenuContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { useSettings } from '../../context/SettingsContext';
import { useDialog } from '../../context/DialogContext';
import { RetroIcon } from '../Icons/RetroIcons';
import type { DesktopIconItem, SelectionRect } from '../../types/desktop';
import type { ContextMenuItem } from '../../types/contextmenu';
import { soundService } from '../../services/soundService';

export const Desktop: React.FC = () => {
  const {
    icons,
    selectedIconIds,
    selectIcon,
    clearSelection,
    moveIcon,
    renameIcon,
    deleteIcon,
    addDesktopIcon,
    arrangeIcons,
    selectIconsInRect,
  } = useDesktop();

  const { openWindow } = useWindowManager();
  const { showContextMenu } = useContextMenu();
  const { createFile, createFolder, fsState } = useFileSystem();
  const { settings } = useSettings();
  const { openPropertiesDialog, showConfirm } = useDialog();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [draggedIconId, setDraggedIconId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);

  // Marquee Selection Box
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const GRID_WIDTH = 75;
  const GRID_HEIGHT = 75;
  const PADDING_X = 10;
  const PADDING_Y = 10;

  // Handle Opening Icon
  const handleOpenIcon = (icon: DesktopIconItem) => {
    soundService.playClick();
    if (icon.appId) {
      if (icon.filePath) {
        if (icon.filePath.endsWith('.txt') || icon.filePath.endsWith('.ini')) {
          openWindow('notepad', { customData: { filePath: icon.filePath } });
        } else if (icon.filePath.endsWith('.bmp') || icon.filePath.endsWith('.png')) {
          openWindow('paint', { customData: { filePath: icon.filePath } });
        } else {
          openWindow(icon.appId, { customData: { path: icon.filePath } });
        }
      } else {
        openWindow(icon.appId);
      }
    } else if (icon.filePath) {
      if (icon.filePath.endsWith('.txt') || icon.filePath.endsWith('.ini')) {
        openWindow('notepad', { customData: { filePath: icon.filePath } });
      } else if (icon.filePath.endsWith('.bmp') || icon.filePath.endsWith('.png')) {
        openWindow('paint', { customData: { filePath: icon.filePath } });
      } else {
        openWindow('explorer', { customData: { path: icon.filePath } });
      }
    }
  };

  // Handle Start Rename
  const handleStartRename = (icon: DesktopIconItem) => {
    if (icon.isSystem) return;
    setRenamingId(icon.id);
    setRenameValue(icon.title);
  };

  // Submit Rename
  const handleSubmitRename = (id: string) => {
    if (renameValue.trim()) {
      renameIcon(id, renameValue.trim());
    }
    setRenamingId(null);
  };

  // Desktop Mouse Down for Marquee Selection
  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (e.target === desktopRef.current) {
      clearSelection();
      setSelectionRect({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
    }
  };

  // Global mouse move and up for Dragging and Marquee
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (selectionRect) {
        setSelectionRect((prev) =>
          prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null
        );
        const left = Math.min(selectionRect.startX, e.clientX);
        const top = Math.min(selectionRect.startY, e.clientY);
        const right = Math.max(selectionRect.startX, e.clientX);
        const bottom = Math.max(selectionRect.startY, e.clientY);
        selectIconsInRect({ left, top, right, bottom });
      } else if (draggedIconId && dragStartPos) {
        // Dragging icon
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (selectionRect) {
        setSelectionRect(null);
      }
      if (draggedIconId) {
        const newGridX = Math.max(0, Math.floor((e.clientX - PADDING_X) / GRID_WIDTH));
        const newGridY = Math.max(0, Math.floor((e.clientY - PADDING_Y) / GRID_HEIGHT));
        moveIcon(draggedIconId, newGridX, newGridY);
        setDraggedIconId(null);
        setDragStartPos(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [selectionRect, draggedIconId, dragStartPos, moveIcon, selectIconsInRect]);

  // Desktop Right Click Menu
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const items: ContextMenuItem[] = [
      {
        id: 'arrange',
        label: 'Arrange Icons',
        subItems: [
          { id: 'auto-arrange', label: 'Auto Arrange', action: () => arrangeIcons() },
          { id: 'align-grid', label: 'Align to Grid', action: () => arrangeIcons() },
        ],
      },
      {
        id: 'refresh',
        label: 'Refresh',
        action: () => {
          soundService.playClick();
        },
      },
      { id: 'sep1', isSeparator: true },
      {
        id: 'new',
        label: 'New',
        subItems: [
          {
            id: 'new-folder',
            label: 'Folder',
            icon: 'folder',
            action: () => {
              const node = createFolder('C:\\Desktop', 'New Folder');
              if (node) {
                addDesktopIcon({
                  title: 'New Folder',
                  icon: 'folder',
                  filePath: node.path,
                  gridX: 2,
                  gridY: 0,
                  isSystem: false,
                });
              }
            },
          },
          {
            id: 'new-txt',
            label: 'Text Document',
            icon: 'notepad',
            action: () => {
              const node = createFile('C:\\Desktop', 'New Text Document.txt', '', 'txt');
              if (node) {
                addDesktopIcon({
                  title: 'New Text Document.txt',
                  icon: 'notepad',
                  filePath: node.path,
                  gridX: 2,
                  gridY: 1,
                  isSystem: false,
                });
              }
            },
          },
          {
            id: 'new-bmp',
            label: 'Bitmap Image',
            icon: 'paint',
            action: () => {
              const node = createFile('C:\\Desktop', 'New Bitmap Image.bmp', '', 'bmp');
              if (node) {
                addDesktopIcon({
                  title: 'New Bitmap Image.bmp',
                  icon: 'paint',
                  filePath: node.path,
                  gridX: 2,
                  gridY: 2,
                  isSystem: false,
                });
              }
            },
          },
        ],
      },
      { id: 'sep2', isSeparator: true },
      {
        id: 'properties',
        label: 'Properties',
        action: () => openWindow('display-properties'),
      },
    ];

    showContextMenu(e.clientX, e.clientY, items);
  };

  // Icon Right Click Menu
  const handleIconContextMenu = (e: React.MouseEvent, icon: DesktopIconItem) => {
    e.preventDefault();
    e.stopPropagation();
    selectIcon(icon.id);

    const items: ContextMenuItem[] = [
      {
        id: 'open',
        label: 'Open',
        action: () => handleOpenIcon(icon),
      },
    ];

    if (!icon.isSystem) {
      items.push(
        {
          id: 'rename',
          label: 'Rename',
          action: () => handleStartRename(icon),
        },
        {
          id: 'delete',
          label: 'Delete',
          action: () => {
            showConfirm(
              `Are you sure you want to send '${icon.title}' to the Recycle Bin?`,
              () => deleteIcon(icon.id),
              undefined,
              'Confirm File Delete'
            );
          },
        }
      );
    }

    items.push(
      { id: 'sep1', isSeparator: true },
      {
        id: 'properties',
        label: 'Properties',
        action: () => {
          openPropertiesDialog({
            title: `${icon.title} Properties`,
            targetType: icon.filePath ? 'file' : 'desktop',
            customData: { icon },
          });
        },
      }
    );

    showContextMenu(e.clientX, e.clientY, items);
  };

  // Wallpaper Class / Style
  let wallpaperClass = 'bg-[#008080]';
  let wallpaperStyle: React.CSSProperties = {};
  if (settings.wallpaperTheme === 'clouds') wallpaperClass = 'pattern-clouds';
  else if (settings.wallpaperTheme === 'matrix') wallpaperClass = 'pattern-matrix';
  else if (settings.wallpaperTheme === 'blue') wallpaperClass = 'pattern-blue';
  else if (settings.wallpaperTheme === 'sunset') wallpaperClass = 'pattern-sunset';
  else if (settings.wallpaperTheme === 'custom' && settings.customWallpaperUrl) {
    wallpaperStyle = {
      backgroundImage: `url(${settings.customWallpaperUrl})`,
      backgroundSize: settings.wallpaperMode === 'stretch' ? 'cover' : settings.wallpaperMode === 'tile' ? 'auto' : 'contain',
      backgroundRepeat: settings.wallpaperMode === 'tile' ? 'repeat' : 'no-repeat',
      backgroundPosition: 'center',
    };
  }

  return (
    <div
      ref={desktopRef}
      className={`absolute inset-0 select-none overflow-hidden pb-[28px] ${wallpaperClass}`}
      style={wallpaperStyle}
      onMouseDown={handleDesktopMouseDown}
      onContextMenu={handleDesktopContextMenu}
    >
      {/* Desktop Icons */}
      {icons.map((icon) => {
        const isSelected = selectedIconIds.includes(icon.id);
        const isRenaming = renamingId === icon.id;
        const iconLeft = PADDING_X + icon.gridX * GRID_WIDTH;
        const iconTop = PADDING_Y + icon.gridY * GRID_HEIGHT;

        // Dynamic icon for Recycle Bin
        let currentIconName = icon.icon;
        if (icon.id === 'icon_recycle_bin') {
          currentIconName = (fsState.recycleBin?.length || 0) > 0 ? 'recycle-bin-full' : 'recycle-bin-empty';
        }

        return (
          <div
            key={icon.id}
            className="absolute flex flex-col items-center justify-center cursor-default group"
            style={{
              left: `${iconLeft}px`,
              top: `${iconTop}px`,
              width: `${GRID_WIDTH}px`,
              height: `${GRID_HEIGHT}px`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              if (e.button === 0) {
                selectIcon(icon.id, e.ctrlKey || e.shiftKey);
                setDraggedIconId(icon.id);
                setDragStartPos({ x: e.clientX, y: e.clientY });
              }
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              handleOpenIcon(icon);
            }}
            onContextMenu={(e) => handleIconContextMenu(e, icon)}
          >
            {/* Icon Graphic */}
            <div className={`p-1 relative flex items-center justify-center ${isSelected ? 'brightness-90' : ''}`}>
              <RetroIcon name={currentIconName} size={32} />
              {isSelected && (
                <div className="absolute inset-0 bg-[#000080] opacity-25 mix-blend-multiply pointer-events-none" />
              )}
            </div>

            {/* Icon Title or Rename Input */}
            {isRenaming ? (
              <input
                type="text"
                autoFocus
                className="win-input text-[11px] text-center w-[70px] py-0 px-1 mt-0.5"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => handleSubmitRename(icon.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitRename(icon.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={`text-[11px] text-center leading-tight px-1 py-0.5 mt-0.5 rounded-none max-w-[70px] line-clamp-2 select-none tracking-tight ${
                  isSelected
                    ? 'bg-[#000080] text-white win-focus-box'
                    : 'text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]'
                }`}
              >
                {icon.title}
              </span>
            )}
          </div>
        );
      })}

      {/* Marquee Drag Selection Box */}
      {selectionRect && (
        <div
          className="win-selection-box"
          style={{
            left: `${Math.min(selectionRect.startX, selectionRect.currentX)}px`,
            top: `${Math.min(selectionRect.startY, selectionRect.currentY)}px`,
            width: `${Math.abs(selectionRect.currentX - selectionRect.startX)}px`,
            height: `${Math.abs(selectionRect.currentY - selectionRect.startY)}px`,
          }}
        />
      )}
    </div>
  );
};

