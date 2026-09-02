import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { DesktopIconItem } from '../types/desktop';
import { loadDesktopIcons, saveDesktopIcons, defaultDesktopIcons } from '../services/storageService';
import { useFileSystem } from './FileSystemContext';

interface DesktopContextType {
  icons: DesktopIconItem[];
  selectedIconIds: string[];
  selectIcon: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  moveIcon: (id: string, gridX: number, gridY: number) => void;
  renameIcon: (id: string, newTitle: string) => void;
  deleteIcon: (id: string) => void;
  addDesktopIcon: (icon: Omit<DesktopIconItem, 'id'>) => void;
  arrangeIcons: () => void;
  resetDesktopIcons: () => void;
  selectIconsInRect: (rect: { left: number; top: number; right: number; bottom: number }) => void;
}

const DesktopContext = createContext<DesktopContextType | null>(null);

export const DesktopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [icons, setIcons] = useState<DesktopIconItem[]>(loadDesktopIcons);
  const [selectedIconIds, setSelectedIconIds] = useState<string[]>([]);
  const { deleteNode, renameNode, fsState } = useFileSystem();

  useEffect(() => {
    saveDesktopIcons(icons);
  }, [icons]);

  const selectIcon = useCallback((id: string, multi: boolean = false) => {
    setSelectedIconIds((prev) => {
      if (multi) {
        return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return [id];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIconIds([]);
  }, []);

  const moveIcon = useCallback((id: string, gridX: number, gridY: number) => {
    setIcons((prev) =>
      prev.map((icon) => (icon.id === id ? { ...icon, gridX: Math.max(0, gridX), gridY: Math.max(0, gridY) } : icon))
    );
  }, []);

  const renameIcon = useCallback((id: string, newTitle: string) => {
    setIcons((prev) =>
      prev.map((icon) => {
        if (icon.id === id && !icon.isSystem) {
          if (icon.filePath) {
            const node = Object.values(fsState.nodes).find((n) => n.path === icon.filePath);
            if (node) {
              renameNode(node.id, newTitle);
            }
          }
          return { ...icon, title: newTitle };
        }
        return icon;
      })
    );
  }, [fsState, renameNode]);

  const deleteIcon = useCallback((id: string) => {
    setIcons((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target && !target.isSystem) {
        if (target.filePath) {
          const node = Object.values(fsState.nodes).find((n) => n.path === target.filePath);
          if (node) {
            deleteNode(node.id, false);
          }
        }
        return prev.filter((i) => i.id !== id);
      }
      return prev;
    });
    setSelectedIconIds((prev) => prev.filter((i) => i !== id));
  }, [fsState, deleteNode]);

  const addDesktopIcon = useCallback((iconData: Omit<DesktopIconItem, 'id'>) => {
    const id = `dt_icon_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setIcons((prev) => [...prev, { ...iconData, id }]);
  }, []);

  const arrangeIcons = useCallback(() => {
    const maxRows = Math.floor((typeof window !== 'undefined' ? window.innerHeight - 80 : 600) / 75);
    setIcons((prev) => {
      return prev.map((icon, index) => ({
        ...icon,
        gridX: Math.floor(index / Math.max(1, maxRows)),
        gridY: index % Math.max(1, maxRows),
      }));
    });
  }, []);

  const resetDesktopIcons = useCallback(() => {
    setIcons(defaultDesktopIcons);
    setSelectedIconIds([]);
  }, []);

  const selectIconsInRect = useCallback((rect: { left: number; top: number; right: number; bottom: number }) => {
    const selected: string[] = [];
    const iconWidth = 74;
    const iconHeight = 72;
    const paddingX = 10;
    const paddingY = 10;

    icons.forEach((icon) => {
      const x = paddingX + icon.gridX * iconWidth;
      const y = paddingY + icon.gridY * iconHeight;
      const iconRect = { left: x, top: y, right: x + iconWidth, bottom: y + iconHeight };

      const overlaps = !(
        rect.right < iconRect.left ||
        rect.left > iconRect.right ||
        rect.bottom < iconRect.top ||
        rect.top > iconRect.bottom
      );

      if (overlaps) {
        selected.push(icon.id);
      }
    });

    setSelectedIconIds(selected);
  }, [icons]);

  return (
    <DesktopContext.Provider
      value={{
        icons,
        selectedIconIds,
        selectIcon,
        clearSelection,
        moveIcon,
        renameIcon,
        deleteIcon,
        addDesktopIcon,
        arrangeIcons,
        resetDesktopIcons,
        selectIconsInRect,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) throw new Error('useDesktop must be used within a DesktopProvider');
  return context;
};

