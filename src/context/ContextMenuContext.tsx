import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ContextMenuItem, ContextMenuState } from '../types/contextmenu';

interface ContextMenuContextType {
  contextMenu: ContextMenuState;
  showContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  hideContextMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export const ContextMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    items: [],
  });

  const showContextMenu = useCallback((x: number, y: number, items: ContextMenuItem[]) => {
    const menuWidth = 160;
    const menuHeight = items.length * 24 + 10;
    const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;

    const clampedX = x + menuWidth > screenW ? Math.max(0, x - menuWidth) : x;
    const clampedY = y + menuHeight > screenH ? Math.max(0, y - menuHeight) : y;

    setContextMenu({
      isOpen: true,
      x: clampedX,
      y: clampedY,
      items,
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu((prev) => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    const handleGlobalClick = () => {
      if (contextMenu.isOpen) {
        hideContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && contextMenu.isOpen) {
        hideContextMenu();
      }
    };

    window.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.isOpen, hideContextMenu]);

  return (
    <ContextMenuContext.Provider
      value={{
        contextMenu,
        showContextMenu,
        hideContextMenu,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);
  if (!context) throw new Error('useContextMenu must be used within a ContextMenuProvider');
  return context;
};

