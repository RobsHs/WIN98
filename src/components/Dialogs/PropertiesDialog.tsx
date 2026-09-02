import React, { useState } from 'react';
import { useDialog } from '../../context/DialogContext';
import type { PropertiesDialogOptions } from '../../context/DialogContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { RetroIcon } from '../Icons/RetroIcons';
import { soundService } from '../../services/soundService';

export const PropertiesDialogContainer: React.FC = () => {
  const { propertiesDialogs, closePropertiesDialog } = useDialog();

  if (propertiesDialogs.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-black bg-opacity-10 pointer-events-auto select-none">
      {propertiesDialogs.map((dialog) => (
        <PropertiesDialogItem key={dialog.id} dialog={dialog} onClose={() => closePropertiesDialog(dialog.id)} />
      ))}
    </div>
  );
};

const PropertiesDialogItem: React.FC<{ dialog: PropertiesDialogOptions; onClose: () => void }> = ({
  dialog,
  onClose,
}) => {
  const { getNodeById } = useFileSystem();
  const [activeTab, setActiveTab] = useState<'general' | 'sharing'>('general');

  const node = dialog.targetId ? getNodeById(dialog.targetId) : null;
  const isFolder = node?.type === 'folder' || dialog.targetType === 'folder';

  return (
    <div className="win-outset w-[360px] p-1 bg-[#c0c0c0] shadow-2xl flex flex-col text-[11px] m-4">
      {/* Title bar */}
      <div className="win-titlebar active flex items-center justify-between mb-2">
        <span className="font-bold">{dialog.title}</span>
        <button className="win-titlebar-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="px-2 pt-1 flex items-center space-x-1 border-b border-[#808080]">
        <button
          className={`win-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`win-tab ${activeTab === 'sharing' ? 'active' : ''}`}
          onClick={() => setActiveTab('sharing')}
        >
          Sharing
        </button>
      </div>

      {/* Tab Content */}
      <div className="win-tab-content p-4 min-h-[220px]">
        {activeTab === 'general' ? (
          <div className="flex flex-col space-y-3">
            {/* Header info */}
            <div className="flex items-center space-x-3 pb-3 border-b border-[#808080]">
              <RetroIcon name={isFolder ? 'folder' : node?.extension === 'bmp' ? 'paint' : 'notepad'} size={32} />
              <input
                type="text"
                readOnly
                className="win-input flex-1 py-1 font-bold"
                value={node ? node.name : dialog.customData?.icon?.title || 'Item Properties'}
              />
            </div>

            {/* Details table */}
            <div className="flex flex-col space-y-2 text-[11px]">
              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#404040]">Type:</span>
                <span className="col-span-2 font-medium">
                  {isFolder ? 'File Folder' : `${(node?.extension || 'TXT').toUpperCase()} File`}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#404040]">Location:</span>
                <span className="col-span-2 font-mono text-[10px] truncate">
                  {node ? node.path : 'C:\\WINDOWS'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#404040]">Size:</span>
                <span className="col-span-2">
                  {node ? `${node.size} bytes (${Math.max(1, Math.round(node.size / 1024))} KB)` : '0 bytes'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1">
                <span className="text-[#404040]">Created:</span>
                <span className="col-span-2">
                  {new Date(node?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Attributes */}
            <div className="win-fieldset mt-3 p-2">
              <legend className="win-legend">Attributes</legend>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input type="checkbox" defaultChecked={node?.isReadOnly} />
                  <span>Read-only</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input type="checkbox" defaultChecked={node?.isHidden} />
                  <span>Hidden</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input type="checkbox" defaultChecked />
                  <span>Archive</span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            <span className="font-bold">Sharing options:</span>
            <label className="flex items-center space-x-2">
              <input type="radio" name="share" defaultChecked />
              <span>Not Shared</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="share" />
              <span>Shared As:</span>
            </label>
            <div className="pl-6">
              <input type="text" className="win-input w-full" defaultValue={node?.name} disabled />
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-2 p-2 border-t border-[#808080]">
        <button
          className="win-btn font-bold px-4"
          onClick={() => {
            soundService.playClick();
            onClose();
          }}
        >
          OK
        </button>
        <button
          className="win-btn px-4"
          onClick={() => {
            soundService.playClick();
            onClose();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

