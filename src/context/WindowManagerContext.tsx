import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import type { WindowState, WindowBounds } from '../types/window';
import { APP_REGISTRY } from '../apps/registry';

interface OpenWindowOptions {
  appId: string;
  title?: string;
  customData?: any;
  bounds?: Partial<WindowBounds>;
  singleInstance?: boolean;
}

interface WindowManagerContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (appId: string, options?: Partial<OpenWindowOptions>) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, bounds: WindowBounds) => void;
  setWindowTitle: (id: string, title: string) => void;
  minimizeAll: () => void;
  activeWindow: WindowState | null;
}

const WindowManagerContext = createContext<WindowManagerContextType | null>(null);

let cascadeOffset = 0;

export const WindowManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const zIndexRef = useRef<number>(100);

  const focusWindow = useCallback((id: string) => {
    zIndexRef.current += 1;
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isFocused: true, isMinimized: false, zIndex: zIndexRef.current }
          : { ...w, isFocused: false }
      )
    );
  }, []);

  const openWindow = useCallback(
    (appId: string, options: Partial<OpenWindowOptions> = {}): string => {
      const app = APP_REGISTRY[appId] || {
        id: appId,
        name: options.title || 'Application',
        icon: 'application',
        defaultWidth: 500,
        defaultHeight: 380,
        minWidth: 300,
        minHeight: 200,
        canResize: true,
        canMaximize: true,
        canMinimize: true,
      };

      // Check single instance apps
      const isSingle = options.singleInstance ?? (app.isDialog || appId === 'calculator' || appId === 'control-panel' || appId === 'display-properties' || appId === 'system-info' || appId === 'minesweeper');
      if (isSingle) {
        const existing = windows.find((w) => w.appId === appId);
        if (existing) {
          if (options.customData) {
            existing.customData = options.customData;
          }
          focusWindow(existing.id);
          return existing.id;
        }
      }

      zIndexRef.current += 1;
      const windowId = `win_${appId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Calculate initial position with cascade
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 768;
      const width = options.bounds?.width || app.defaultWidth || 500;
      const height = options.bounds?.height || app.defaultHeight || 380;

      const baseX = Math.max(30, Math.min(screenW - width - 40, (screenW - width) / 2 + cascadeOffset));
      const baseY = Math.max(30, Math.min(screenH - height - 60, (screenH - height) / 3 + cascadeOffset));
      cascadeOffset = (cascadeOffset + 24) % 120;

      const newWindow: WindowState = {
        id: windowId,
        appId,
        title: options.title || app.name,
        icon: app.icon,
        bounds: {
          x: options.bounds?.x ?? baseX,
          y: options.bounds?.y ?? baseY,
          width,
          height,
        },
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
        zIndex: zIndexRef.current,
        isDialog: app.isDialog || false,
        canResize: app.canResize !== undefined ? app.canResize : true,
        canMinimize: app.canMinimize !== undefined ? app.canMinimize : true,
        canMaximize: app.canMaximize !== undefined ? app.canMaximize : true,
        minWidth: app.minWidth || 200,
        minHeight: app.minHeight || 150,
        customData: options.customData,
      };

      setActiveWindowId(windowId);
      setWindows((prev) => [
        ...prev.map((w) => ({ ...w, isFocused: false })),
        newWindow,
      ]);

      return windowId;
    },
    [windows, focusWindow]
  );

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const remaining = prev.filter((w) => w.id !== id);
      if (activeWindowId === id) {
        // Focus top most window
        const nonMinimized = remaining.filter((w) => !w.isMinimized);
        if (nonMinimized.length > 0) {
          const topWindow = nonMinimized.reduce((prevW, currW) =>
            currW.zIndex > prevW.zIndex ? currW : prevW
          );
          setActiveWindowId(topWindow.id);
          return remaining.map((w) =>
            w.id === topWindow.id ? { ...w, isFocused: true } : { ...w, isFocused: false }
          );
        } else {
          setActiveWindowId(null);
        }
      }
      return remaining;
    });
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, isMinimized: true, isFocused: false } : w));
      if (activeWindowId === id) {
        const nonMin = next.filter((w) => !w.isMinimized);
        if (nonMin.length > 0) {
          const top = nonMin.reduce((p, c) => (c.zIndex > p.zIndex ? c : p));
          setActiveWindowId(top.id);
          return next.map((w) => (w.id === top.id ? { ...w, isFocused: true } : w));
        } else {
          setActiveWindowId(null);
        }
      }
      return next;
    });
  }, [activeWindowId]);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.isMaximized) {
          // Restore
          return {
            ...w,
            isMaximized: false,
            bounds: w.prevBounds || w.bounds,
          };
        } else {
          // Maximize
          return {
            ...w,
            isMaximized: true,
            prevBounds: { ...w.bounds },
          };
        }
      })
    );
  }, []);

  const restoreWindow = useCallback((id: string) => {
    focusWindow(id);
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false, isFocused: true } : w))
    );
  }, [focusWindow]);

  const toggleWindow = useCallback(
    (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return;
      if (win.isMinimized) {
        restoreWindow(id);
      } else if (win.isFocused) {
        minimizeWindow(id);
      } else {
        focusWindow(id);
      }
    },
    [windows, restoreWindow, minimizeWindow, focusWindow]
  );

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id || w.isMaximized) return w;
        // Limit top coordinate so titlebar doesn't vanish
        const clampedY = Math.max(0, y);
        return {
          ...w,
          bounds: { ...w.bounds, x, y: clampedY },
        };
      })
    );
  }, []);

  const resizeWindow = useCallback((id: string, bounds: WindowBounds) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        return {
          ...w,
          bounds,
        };
      })
    );
  }, []);

  const setWindowTitle = useCallback((id: string, title: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, title } : w))
    );
  }, []);

  const minimizeAll = useCallback(() => {
    setWindows((prev) => prev.map((w) => ({ ...w, isMinimized: true, isFocused: false })));
    setActiveWindowId(null);
  }, []);

  const activeWindow = windows.find((w) => w.id === activeWindowId) || null;

  return (
    <WindowManagerContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        toggleWindow,
        moveWindow,
        resizeWindow,
        setWindowTitle,
        minimizeAll,
        activeWindow,
      }}
    >
      {children}
    </WindowManagerContext.Provider>
  );
};

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) throw new Error('useWindowManager must be used within a WindowManagerProvider');
  return context;
};

