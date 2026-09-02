import React, { useState } from 'react';
import { useContextMenu } from '../../context/ContextMenuContext';
import type { ContextMenuItem } from '../../types/contextmenu';
import { RetroIcon } from '../Icons/RetroIcons';
import { soundService } from '../../services/soundService';

export const ContextMenu: React.FC = () => {
  const { contextMenu, hideContextMenu } = useContextMenu();
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);

  if (!contextMenu.isOpen || contextMenu.items.length === 0) return null;

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled || item.isSeparator) return;
    soundService.playClick();
    if (item.action) {
      item.action();
    }
    hideContextMenu();
  };

  return (
    <div
      className="fixed z-[99999] win-outset p-0.5 min-w-[160px] shadow-md bg-[#c0c0c0] select-none"
      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col">
        {contextMenu.items.map((item) => {
          if (item.isSeparator) {
            return (
              <div
                key={item.id}
                className="my-1 border-t border-[#808080] border-b border-white"
              />
            );
          }

          const hasSubmenu = item.subItems && item.subItems.length > 0;
          const isHovered = activeSubmenuId === item.id;

          return (
            <div
              key={item.id}
              className={`relative flex items-center justify-between px-2 py-1 text-[11px] cursor-default ${
                item.disabled
                  ? 'text-[#808080]'
                  : isHovered
                  ? 'bg-[#000080] text-white'
                  : 'hover:bg-[#000080] hover:text-white'
              }`}
              onMouseEnter={() => hasSubmenu && setActiveSubmenuId(item.id)}
              onMouseLeave={() => hasSubmenu && setActiveSubmenuId(null)}
              onClick={() => !hasSubmenu && handleItemClick(item)}
            >
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 flex items-center justify-center">
                  {item.checked && <span className="font-bold text-[12px]">✓</span>}
                  {item.icon && <RetroIcon name={item.icon} size={14} />}
                </div>
                <span className={item.disabled ? 'text-[#808080]' : ''}>
                  {item.label}
                </span>
              </div>

              {item.shortcut && (
                <span className="text-[10px] ml-4 text-inherit opacity-80">
                  {item.shortcut}
                </span>
              )}

              {hasSubmenu && (
                <span className="text-[10px] ml-3">▶</span>
              )}

              {/* Submenu Dropdown */}
              {hasSubmenu && isHovered && (
                <div className="absolute left-[98%] top-0 win-outset p-0.5 min-w-[150px] shadow-md bg-[#c0c0c0] text-black">
                  {item.subItems!.map((subItem) => {
                    if (subItem.isSeparator) {
                      return (
                        <div
                          key={subItem.id}
                          className="my-1 border-t border-[#808080] border-b border-white"
                        />
                      );
                    }
                    return (
                      <div
                        key={subItem.id}
                        className={`flex items-center justify-between px-2 py-1 text-[11px] cursor-default hover:bg-[#000080] hover:text-white ${
                          subItem.disabled ? 'text-[#808080]' : ''
                        }`}
                        onClick={() => handleItemClick(subItem)}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 flex items-center justify-center">
                            {subItem.checked && <span className="font-bold">✓</span>}
                            {subItem.icon && <RetroIcon name={subItem.icon} size={14} />}
                          </div>
                          <span>{subItem.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

