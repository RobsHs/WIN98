import React, { useState } from 'react';
import { useDialog } from '../../context/DialogContext';
import { useFileSystem } from '../../context/FileSystemContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { RetroIcon } from '../Icons/RetroIcons';
import type { VFSNode } from '../../types/filesystem';
import { soundService } from '../../services/soundService';

export const FindDialog: React.FC = () => {
  const { isFindDialogOpen, closeFindDialog } = useDialog();
  const { searchFiles } = useFileSystem();
  const { openWindow } = useWindowManager();

  const [namedQuery, setNamedQuery] = useState('');
  const [lookIn, setLookIn] = useState('C:');
  const [results, setResults] = useState<VFSNode[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isFindDialogOpen) return null;

  const handleSearch = () => {
    soundService.playClick();
    const found = searchFiles(namedQuery, lookIn);
    setResults(found);
    setHasSearched(true);
  };

  const handleOpenItem = (node: VFSNode) => {
    soundService.playClick();
    if (node.type === 'folder') {
      openWindow('explorer', { customData: { path: node.path } });
    } else if (node.extension === 'txt' || node.extension === 'ini') {
      openWindow('notepad', { customData: { filePath: node.path } });
    } else if (node.extension === 'bmp') {
      openWindow('paint', { customData: { filePath: node.path } });
    } else {
      openWindow('explorer', { customData: { path: node.path } });
    }
  };

  return (
    <div
      className="fixed inset-0 z-[99998] flex items-center justify-center bg-black bg-opacity-20 select-none"
      onClick={closeFindDialog}
    >
      <div
        className="win-outset w-[480px] p-1 bg-[#c0c0c0] shadow-2xl flex flex-col text-[11px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="win-titlebar active flex items-center justify-between mb-2">
          <span className="font-bold">Find: All Files</span>
          <button className="win-titlebar-btn" onClick={closeFindDialog}>
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col space-y-3">
          <div className="grid grid-cols-4 gap-2 items-center">
            <label className="col-span-1 font-bold"><u>N</u>amed:</label>
            <input
              type="text"
              className="win-input col-span-3 py-1 px-2"
              value={namedQuery}
              placeholder="e.g. *.txt, README, System"
              onChange={(e) => setNamedQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            <label className="col-span-1 font-bold"><u>L</u>ook in:</label>
            <input
              type="text"
              className="win-input col-span-3 py-1 px-2"
              value={lookIn}
              onChange={(e) => setLookIn(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1 border-b border-[#808080] pb-2">
            <button className="win-btn font-bold px-4" onClick={handleSearch}>
              Find Now
            </button>
            <button
              className="win-btn px-4"
              onClick={() => {
                setNamedQuery('');
                setResults([]);
                setHasSearched(false);
              }}
            >
              New Search
            </button>
            <button className="win-btn px-4" onClick={closeFindDialog}>
              Cancel
            </button>
          </div>

          {/* Search Results List */}
          <div className="win-inset bg-white h-[160px] overflow-y-auto p-1">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#dfdfdf] border-b border-[#808080]">
                  <th className="p-1">Name</th>
                  <th className="p-1">In Folder</th>
                  <th className="p-1">Size</th>
                  <th className="p-1">Type</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#000080] hover:text-white cursor-pointer select-none"
                    onDoubleClick={() => handleOpenItem(item)}
                  >
                    <td className="p-1 flex items-center space-x-1 truncate">
                      <RetroIcon
                        name={item.type === 'folder' ? 'folder' : item.extension === 'bmp' ? 'paint' : 'notepad'}
                        size={14}
                      />
                      <span>{item.name}</span>
                    </td>
                    <td className="p-1 truncate text-[10px] opacity-80">{item.path}</td>
                    <td className="p-1">{item.type === 'file' ? `${item.size} bytes` : ''}</td>
                    <td className="p-1 uppercase">{item.type === 'folder' ? 'Folder' : item.extension}</td>
                  </tr>
                ))}
                {hasSearched && results.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                      No files or folders found matching '{namedQuery}'.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="text-[10px] text-[#404040]">
            {results.length} file(s) found. Double-click to open.
          </div>
        </div>
      </div>
    </div>
  );
};

