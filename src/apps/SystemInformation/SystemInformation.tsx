import React, { useState } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';

export const SystemInformation: React.FC = () => {
  const { fsState } = useFileSystem();
  const [selectedCategory, setSelectedCategory] = useState<'summary' | 'hardware' | 'browser' | 'storage'>('summary');

  const fileCount = Object.values(fsState.nodes).filter((n) => n.type === 'file').length;
  const folderCount = Object.values(fsState.nodes).filter((n) => n.type === 'folder').length;
  const totalBytes = Object.values(fsState.nodes).reduce((acc, n) => acc + (n.size || 0), 0);

  const getDetails = () => {
    switch (selectedCategory) {
      case 'summary':
        return [
          { item: 'OS Name', value: 'Microsoft Windows 98 (Web Desktop Edition)' },
          { item: 'Version', value: '4.10.1998 SE' },
          { item: 'System Manufacturer', value: 'Browser Emulation Systems Inc.' },
          { item: 'System Model', value: 'Web-Based Virtual Machine' },
          { item: 'Processor', value: `${navigator.hardwareConcurrency || 4} CPU Threads Simulated` },
          { item: 'BIOS Version', value: 'Award Modular BIOS v4.51PG' },
          { item: 'Windows Directory', value: 'C:\\WINDOWS' },
          { item: 'Total Physical Memory', value: '64.0 MB RAM (Emulated)' },
          { item: 'Available Memory', value: '48.2 MB RAM' },
          { item: 'Page File Space', value: '128 MB' },
        ];
      case 'hardware':
        return [
          { item: 'Screen Resolution', value: `${window.innerWidth} x ${window.innerHeight} pixels` },
          { item: 'Color Depth', value: `${window.screen.colorDepth || 32}-bit True Color` },
          { item: 'Logical CPU Cores', value: `${navigator.hardwareConcurrency || 'N/A'}` },
          { item: 'Device Memory Limit', value: `${(navigator as any).deviceMemory ? (navigator as any).deviceMemory + ' GB' : 'Not reported by browser'}` },
          { item: 'Touch Support', value: navigator.maxTouchPoints > 0 ? 'Yes' : 'No' },
          { item: 'Pointer Type', value: 'Fine (Mouse/Trackpad)' },
        ];
      case 'browser':
        return [
          { item: 'User Agent', value: navigator.userAgent },
          { item: 'System Language', value: navigator.language },
          { item: 'Online Status', value: navigator.onLine ? 'Connected' : 'Offline' },
          { item: 'Cookies Enabled', value: navigator.cookieEnabled ? 'Yes' : 'No' },
          { item: 'Platform', value: navigator.platform },
          { item: 'Audio Context API', value: 'Supported (Web Audio Synthesizer)' },
          { item: 'IndexedDB Storage', value: 'Enabled & Persistent' },
        ];
      case 'storage':
        return [
          { item: 'Virtual Drive', value: 'C: (Local Disk)' },
          { item: 'File System Type', value: 'FAT32 (IndexedDB Virtual Layer)' },
          { item: 'Total Folders', value: `${folderCount} folders` },
          { item: 'Total Files', value: `${fileCount} files` },
          { item: 'Virtual Files Size', value: `${totalBytes} bytes` },
          { item: 'Recycle Bin Items', value: `${fsState.recycleBin?.length || 0} deleted objects` },
          { item: 'Simulated Drive Capacity', value: '8.40 GB' },
          { item: 'Simulated Free Space', value: '7.84 GB Free' },
        ];
    }
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

      {/* Main Container: Left Tree View + Right Details Table */}
      <div className="flex-1 flex overflow-hidden win-inset bg-white p-1">
        {/* Left Categories Tree */}
        <div className="w-[180px] border-r border-[#808080] pr-2 overflow-y-auto">
          <div className="font-bold text-[11px] mb-1 p-1 bg-[#dfdfdf]">System Information</div>
          <div
            className={`p-1 flex items-center space-x-1.5 cursor-default ${
              selectedCategory === 'summary' ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedCategory('summary')}
          >
            <span>📁</span>
            <span>System Summary</span>
          </div>
          <div
            className={`p-1 flex items-center space-x-1.5 cursor-default ${
              selectedCategory === 'hardware' ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedCategory('hardware')}
          >
            <span>📁</span>
            <span>Hardware Resources</span>
          </div>
          <div
            className={`p-1 flex items-center space-x-1.5 cursor-default ${
              selectedCategory === 'browser' ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedCategory('browser')}
          >
            <span>📁</span>
            <span>Browser &amp; Environment</span>
          </div>
          <div
            className={`p-1 flex items-center space-x-1.5 cursor-default ${
              selectedCategory === 'storage' ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedCategory('storage')}
          >
            <span>📁</span>
            <span>Virtual Storage &amp; VFS</span>
          </div>
        </div>

        {/* Right Details Table */}
        <div className="flex-1 pl-2 overflow-y-auto select-text">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-[#dfdfdf] border-b border-[#808080]">
                <th className="p-1.5 w-1/3">Item</th>
                <th className="p-1.5 w-2/3">Value</th>
              </tr>
            </thead>
            <tbody>
              {getDetails().map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-1.5 font-bold text-[#000080]">{row.item}</td>
                  <td className="p-1.5 break-all">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5">System diagnostics ready.</div>
      </div>
    </div>
  );
};

