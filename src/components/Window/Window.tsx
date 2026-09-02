import React, { useState, useRef, useEffect } from 'react';
import type { WindowState, ResizeDirection, WindowBounds } from '../../types/window';
import { useWindowManager } from '../../context/WindowManagerContext';
import { RetroIcon } from '../Icons/RetroIcons';
import { soundService } from '../../services/soundService';

interface WindowProps {
  window: WindowState;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window: win, children }) => {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    activeWindowId,
  } = useWindowManager();

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingDir, setResizingDir] = useState<ResizeDirection | null>(null);
  const resizeStartRef = useRef<{ startX: number; startY: number; startBounds: WindowBounds } | null>(null);

  const isFocused = win.id === activeWindowId;

  // Handle Drag Start
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || win.isMaximized) return;
    focusWindow(win.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.bounds.x,
      y: e.clientY - win.bounds.y,
    });
  };

  // Handle Resize Start
  const handleResizeMouseDown = (dir: ResizeDirection, e: React.MouseEvent) => {
    if (e.button !== 0 || win.isMaximized || !win.canResize) return;
    e.stopPropagation();
    focusWindow(win.id);
    setResizingDir(dir);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startBounds: { ...win.bounds },
    };
  };

  // Drag and Resize Mouse Listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !win.isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        moveWindow(win.id, newX, newY);
      } else if (resizingDir && resizeStartRef.current && !win.isMaximized) {
        const { startX, startY, startBounds } = resizeStartRef.current;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newX = startBounds.x;
        let newY = startBounds.y;
        let newWidth = startBounds.width;
        let newHeight = startBounds.height;

        const minW = win.minWidth || 220;
        const minH = win.minHeight || 160;

        if (resizingDir.includes('e')) {
          newWidth = Math.max(minW, startBounds.width + deltaX);
        }
        if (resizingDir.includes('s')) {
          newHeight = Math.max(minH, startBounds.height + deltaY);
        }
        if (resizingDir.includes('w')) {
          const possibleW = startBounds.width - deltaX;
          if (possibleW >= minW) {
            newWidth = possibleW;
            newX = startBounds.x + deltaX;
          }
        }
        if (resizingDir.includes('n')) {
          const possibleH = startBounds.height - deltaY;
          if (possibleH >= minH) {
            newHeight = possibleH;
            newY = startBounds.y + deltaY;
          }
        }

        resizeWindow(win.id, {
          x: newX,
          y: Math.max(0, newY),
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (resizingDir) setResizingDir(null);
    };

    if (isDragging || resizingDir) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, resizingDir, dragOffset, win.id, win.isMaximized, win.minWidth, win.minHeight, moveWindow, resizeWindow]);

  if (win.isMinimized) {
    return null;
  }

  // Calculate style for maximized or normal
  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100% - 28px)', // leave space for taskbar
        zIndex: win.zIndex,
      }
    : {
        position: 'absolute',
        top: `${win.bounds.y}px`,
        left: `${win.bounds.x}px`,
        width: `${win.bounds.width}px`,
        height: `${win.bounds.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      className="win-outset flex flex-col select-none overflow-hidden"
      style={windowStyle}
      onMouseDown={() => focusWindow(win.id)}
    >
      {/* 3D Titlebar */}
      <div
        className={`win-titlebar ${isFocused ? 'active' : 'inactive'} cursor-default flex items-center justify-between`}
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={() => win.canMaximize && maximizeWindow(win.id)}
      >
        <div className="flex items-center space-x-1.5 overflow-hidden pr-2">
          {win.icon && <RetroIcon name={win.icon} size={14} className="flex-shrink-0" />}
          <span className="truncate text-[11px] font-bold tracking-tight">
            {win.title}
          </span>
        </div>

        {/* Titlebar Action Buttons */}
        <div className="flex items-center space-x-0.5 flex-shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          {win.canMinimize && (
            <button
              className="win-titlebar-btn text-[9px] font-bold"
              onClick={() => {
                soundService.playClick();
                minimizeWindow(win.id);
              }}
              title="Minimize"
            >
              _
            </button>
          )}
          {win.canMaximize && (
            <button
              className="win-titlebar-btn text-[10px] font-bold"
              onClick={() => {
                soundService.playClick();
                maximizeWindow(win.id);
              }}
              title={win.isMaximized ? 'Restore' : 'Maximize'}
            >
              {win.isMaximized ? '❐' : '□'}
            </button>
          )}
          <button
            className="win-titlebar-btn text-[10px] font-bold font-sans"
            onClick={() => {
              soundService.playClick();
              closeWindow(win.id);
            }}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#c0c0c0]">
        {children}
      </div>

      {/* 8-Direction Resize Handles (when not maximized and resizable) */}
      {!win.isMaximized && win.canResize && (
        <>
          <div
            className="absolute top-0 left-0 w-full h-[4px] cursor-n-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('n', e)}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-[4px] cursor-s-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('s', e)}
          />
          <div
            className="absolute top-0 left-0 w-[4px] h-full cursor-w-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('w', e)}
          />
          <div
            className="absolute top-0 right-0 w-[4px] h-full cursor-e-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('e', e)}
          />
          <div
            className="absolute top-0 left-0 w-[8px] h-[8px] cursor-nw-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('nw', e)}
          />
          <div
            className="absolute top-0 right-0 w-[8px] h-[8px] cursor-ne-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('ne', e)}
          />
          <div
            className="absolute bottom-0 left-0 w-[8px] h-[8px] cursor-sw-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('sw', e)}
          />
          <div
            className="absolute bottom-0 right-0 w-[8px] h-[8px] cursor-se-resize z-50"
            onMouseDown={(e) => handleResizeMouseDown('se', e)}
          />
        </>
      )}
    </div>
  );
};

