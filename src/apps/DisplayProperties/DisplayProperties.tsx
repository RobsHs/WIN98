import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import type { WallpaperTheme, ScreensaverType, ColorScheme } from '../../types/settings';
import { soundService } from '../../services/soundService';

interface DisplayPropertiesProps {
  windowId?: string;
}

export const DisplayProperties: React.FC<DisplayPropertiesProps> = ({ windowId }) => {
  const { settings, updateSettings } = useSettings();
  const { closeWindow } = useWindowManager();

  const [activeTab, setActiveTab] = useState<'background' | 'screensaver' | 'appearance' | 'settings'>('background');

  // Staged settings
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperTheme>(settings.wallpaperTheme);
  const [selectedScreensaver, setSelectedScreensaver] = useState<ScreensaverType>(settings.screensaver);
  const [screensaverTimeout, setScreensaverTimeout] = useState<number>(settings.screensaverTimeoutMinutes || 5);
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>(settings.colorScheme);
  const [resolution, setResolution] = useState(settings.simulatedResolution);

  const handleApply = () => {
    soundService.playClick();
    updateSettings({
      wallpaperTheme: selectedWallpaper,
      screensaver: selectedScreensaver,
      screensaverTimeoutMinutes: screensaverTimeout,
      colorScheme: selectedScheme,
      simulatedResolution: resolution,
    });
  };

  const handleOk = () => {
    handleApply();
    if (windowId) closeWindow(windowId);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] p-2 overflow-hidden justify-between">
      {/* Tabs Header */}
      <div className="win-tab-container">
        <button
          className={`win-tab ${activeTab === 'background' ? 'active' : ''}`}
          onClick={() => setActiveTab('background')}
        >
          Background
        </button>
        <button
          className={`win-tab ${activeTab === 'screensaver' ? 'active' : ''}`}
          onClick={() => setActiveTab('screensaver')}
        >
          Screen Saver
        </button>
        <button
          className={`win-tab ${activeTab === 'appearance' ? 'active' : ''}`}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance
        </button>
        <button
          className={`win-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content Box */}
      <div className="win-tab-content flex-1 p-3 flex flex-col justify-between">
        {activeTab === 'background' ? (
          <div className="flex flex-col space-y-3">
            {/* Monitor Preview */}
            <div className="flex justify-center items-center py-2">
              <div className="w-36 h-28 win-outset bg-[#dfdfdf] p-1.5 flex flex-col items-center justify-between border border-black shadow-inner">
                <div
                  className={`w-full h-20 win-inset border border-black flex items-center justify-center ${
                    selectedWallpaper === 'clouds'
                      ? 'pattern-clouds'
                      : selectedWallpaper === 'matrix'
                      ? 'pattern-matrix'
                      : selectedWallpaper === 'blue'
                      ? 'pattern-blue'
                      : selectedWallpaper === 'sunset'
                      ? 'pattern-sunset'
                      : 'bg-[#008080]'
                  }`}
                >
                  <div className="win-outset p-0.5 bg-[#c0c0c0] text-[7px] font-bold">
                    Windows 98
                  </div>
                </div>
                <div className="w-8 h-2 bg-gray-600 rounded-sm" />
              </div>
            </div>

            {/* Wallpaper Selection Table */}
            <div className="flex flex-col space-y-1">
              <span className="font-bold"><u>W</u>allpaper:</span>
              <div className="win-inset bg-white h-24 overflow-y-auto p-1 text-[11px]">
                {[
                  { id: 'teal', label: '(None / Classic Teal)' },
                  { id: 'clouds', label: 'Clouds (Windows 98)' },
                  { id: 'blue', label: 'Setup Blue' },
                  { id: 'matrix', label: 'Matrix Grid' },
                  { id: 'sunset', label: 'Sunset Vista' },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`px-2 py-0.5 cursor-default ${
                      selectedWallpaper === item.id ? 'bg-[#000080] text-white' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedWallpaper(item.id as WallpaperTheme)}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeTab === 'screensaver' ? (
          <div className="flex flex-col space-y-3">
            {/* Monitor Preview */}
            <div className="flex justify-center items-center py-2">
              <div className="w-36 h-28 win-outset bg-[#dfdfdf] p-1.5 flex flex-col items-center justify-between border border-black">
                <div className="w-full h-20 win-inset bg-black flex items-center justify-center text-white text-[9px] font-mono">
                  {selectedScreensaver === 'starfield' && '✦ ✧ ✦ ✧'}
                  {selectedScreensaver === 'mystify' && '◇ ◈ ⬖ ⬗'}
                  {selectedScreensaver === '3dtext' && 'Windows 98'}
                  {selectedScreensaver === 'blank' && ''}
                  {selectedScreensaver === 'none' && 'Off'}
                </div>
                <div className="w-8 h-2 bg-gray-600 rounded-sm" />
              </div>
            </div>

            {/* Screen Saver Dropdown */}
            <div className="win-fieldset p-2">
              <legend className="win-legend">Screen Saver</legend>
              <div className="flex items-center space-x-2 mb-2">
                <select
                  className="win-select flex-1"
                  value={selectedScreensaver}
                  onChange={(e) => setSelectedScreensaver(e.target.value as ScreensaverType)}
                >
                  <option value="none">(None)</option>
                  <option value="mystify">Mystify Your Mind</option>
                  <option value="starfield">Starfield Simulation</option>
                  <option value="3dtext">3D Text (OpenGL)</option>
                  <option value="blank">Blank Screen</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 text-[11px]">
                <span><u>W</u>ait:</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  className="win-input w-12 text-center"
                  value={screensaverTimeout}
                  onChange={(e) => setScreensaverTimeout(Math.max(1, Number(e.target.value)))}
                />
                <span>minutes</span>
              </div>
            </div>
          </div>
        ) : activeTab === 'appearance' ? (
          <div className="flex flex-col space-y-3">
            {/* Window Preview */}
            <div className="win-outset p-2 bg-[#c0c0c0] shadow-sm">
              <div className="win-titlebar active p-1 text-[10px] flex justify-between">
                <span>Active Window</span>
                <span>✕</span>
              </div>
              <div className="win-inset bg-white p-2 text-[10px] my-1">
                Window Text &amp; Controls
              </div>
              <div className="win-titlebar inactive p-1 text-[10px] flex justify-between">
                <span>Inactive Window</span>
                <span>✕</span>
              </div>
            </div>

            {/* Scheme Selector */}
            <div className="flex flex-col space-y-1">
              <span className="font-bold"><u>S</u>cheme:</span>
              <select
                className="win-select"
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value as ColorScheme)}
              >
                <option value="classic">Windows Standard (Default)</option>
                <option value="desert">Desert</option>
                <option value="rainyDay">Rainy Day</option>
                <option value="rose">Rose</option>
                <option value="highContrast">High Contrast</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <div className="win-fieldset p-3">
              <legend className="win-legend">Screen Area</legend>
              <div className="flex flex-col space-y-2">
                <span className="font-bold">Simulated Display Resolution:</span>
                <select
                  className="win-select"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value as any)}
                >
                  <option value="auto">Auto (Match Browser Window)</option>
                  <option value="640x480">640 by 480 pixels</option>
                  <option value="800x600">800 by 600 pixels</option>
                  <option value="1024x768">1024 by 768 pixels</option>
                  <option value="1280x1024">1280 by 1024 pixels</option>
                </select>
              </div>
            </div>

            <div className="win-fieldset p-3">
              <legend className="win-legend">Colors</legend>
              <select className="win-select" defaultValue="truecolor">
                <option value="256">256 Colors</option>
                <option value="highcolor">High Color (16 bit)</option>
                <option value="truecolor">True Color (32 bit)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Dialog Action Buttons */}
      <div className="flex justify-end space-x-2 pt-2">
        <button className="win-btn font-bold px-4" onClick={handleOk}>
          OK
        </button>
        <button className="win-btn px-4" onClick={() => windowId && closeWindow(windowId)}>
          Cancel
        </button>
        <button className="win-btn px-4" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

