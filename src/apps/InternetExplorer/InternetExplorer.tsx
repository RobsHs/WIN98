import React, { useState } from 'react';
import { RetroIcon } from '../../components/Icons/RetroIcons';
import { soundService } from '../../services/soundService';

interface InternetExplorerProps {
  initialUrl?: string;
}

export const InternetExplorer: React.FC<InternetExplorerProps> = ({ initialUrl = 'about:home' }) => {
  const [url, setUrl] = useState<string>(initialUrl);
  const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (newUrl: string) => {
    soundService.playClick();
    setIsLoading(true);
    let target = newUrl.trim();
    if (!target.startsWith('about:') && !target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }
    const newHist = history.slice(0, historyIndex + 1);
    newHist.push(target);
    setHistory(newHist);
    setHistoryIndex(newHist.length - 1);
    setCurrentUrl(target);
    setUrl(target);

    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      soundService.playClick();
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setCurrentUrl(history[prev]);
      setUrl(history[prev]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      soundService.playClick();
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setCurrentUrl(history[next]);
      setUrl(history[next]);
    }
  };

  const handleRefresh = () => {
    soundService.playClick();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleHome = () => {
    navigateTo('about:home');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(url);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] overflow-hidden">
      {/* Menu Bar */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>F</u>ile</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>E</u>dit</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>V</u>iew</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>F</u>avorites</span>
        <span className="cursor-default hover:bg-[#000080] hover:text-white px-1"><u>H</u>elp</span>
      </div>

      {/* Navigation Toolbar */}
      <div className="flex items-center justify-between p-1 border-b border-[#808080] bg-[#c0c0c0]">
        <div className="flex items-center space-x-1">
          <button
            className="win-btn px-2 h-[22px] flex items-center space-x-1"
            disabled={historyIndex <= 0}
            onClick={handleBack}
            title="Back"
          >
            <span>←</span>
            <span className="text-[10px]">Back</span>
          </button>
          <button
            className="win-btn px-2 h-[22px] flex items-center space-x-1"
            disabled={historyIndex >= history.length - 1}
            onClick={handleForward}
            title="Forward"
          >
            <span>→</span>
            <span className="text-[10px]">Forward</span>
          </button>
          <button className="win-btn px-2 h-[22px]" onClick={() => setIsLoading(false)} title="Stop">
            ✕ Stop
          </button>
          <button className="win-btn px-2 h-[22px]" onClick={handleRefresh} title="Refresh">
            ↻ Refresh
          </button>
          <button className="win-btn px-2 h-[22px]" onClick={handleHome} title="Home">
            ⌂ Home
          </button>

          <div className="h-[18px] border-l border-[#808080] border-r border-white mx-1" />

          <button className="win-btn px-2 h-[22px]" onClick={() => navigateTo('about:home')} title="Search">
            🔍 Search
          </button>
          <button className="win-btn px-2 h-[22px]" onClick={() => navigateTo('about:welcome')} title="Favorites">
            ★ Favorites
          </button>
          <button className="win-btn px-2 h-[22px]" onClick={() => window.print()} title="Print">
            🖶 Print
          </button>
        </div>

        {/* Animated IE Throbber Logo */}
        <div className={`p-1 win-inset bg-black ${isLoading ? 'animate-spin' : ''}`}>
          <RetroIcon name="internet-explorer" size={18} />
        </div>
      </div>

      {/* Address Bar */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 px-2 py-1 border-b border-[#808080] bg-[#c0c0c0]">
        <span className="font-sans text-[#404040] font-bold text-[11px]">Address</span>
        <input
          type="text"
          className="win-input flex-1 py-0.5 px-2 text-[11px]"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit" className="win-btn h-[20px] px-2 text-[10px]">
          Go
        </button>
      </form>

      {/* Quick Links Bar */}
      <div className="flex items-center space-x-3 px-2 py-0.5 border-b border-[#808080] bg-[#dfdfdf] text-[10px]">
        <span className="text-gray-500 font-bold">Links:</span>
        <span className="cursor-pointer text-[#000080] underline hover:text-red-600" onClick={() => navigateTo('about:home')}>
          MSN Portal
        </span>
        <span className="cursor-pointer text-[#000080] underline hover:text-red-600" onClick={() => navigateTo('about:welcome')}>
          Welcome
        </span>
        <span className="cursor-pointer text-[#000080] underline hover:text-red-600" onClick={() => navigateTo('about:games')}>
          Web Arcade
        </span>
        <span className="cursor-pointer text-[#000080] underline hover:text-red-600" onClick={() => navigateTo('about:help')}>
          Web Tutorial
        </span>
        <span className="cursor-pointer text-[#000080] underline hover:text-red-600" onClick={() => navigateTo('https://wikipedia.org')}>
          Wikipedia
        </span>
      </div>

      {/* Main Browser Viewport */}
      <div className="flex-1 win-inset bg-white overflow-y-auto p-4 select-text">
        {currentUrl === 'about:home' ? (
          <div className="max-w-3xl mx-auto flex flex-col space-y-4">
            {/* Retro MSN Header */}
            <div className="flex justify-between items-center border-b-2 border-[#000080] pb-2">
              <div className="flex items-center space-x-2">
                <RetroIcon name="internet-explorer" size={32} />
                <span className="text-[20px] font-black text-[#000080] tracking-tight">
                  msn<span className="text-[#ef4444]">.</span>com
                </span>
              </div>
              <span className="text-[11px] text-gray-500 font-bold">Welcome to Microsoft Internet Start</span>
            </div>

            {/* Retro Web Search Box */}
            <div className="win-outset p-3 bg-[#e8eef7] flex flex-col space-y-2">
              <span className="font-bold text-[#000080]">Search the Web with MSN Search:</span>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="win-input flex-1 py-1"
                  placeholder="Enter keywords to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigateTo(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`);
                    }
                  }}
                />
                <button
                  className="win-btn font-bold px-4"
                  onClick={() => navigateTo(`https://duckduckgo.com/?q=${encodeURIComponent(searchQuery)}`)}
                >
                  Search
                </button>
              </div>
            </div>

            {/* Retro Web Directory */}
            <div className="grid grid-cols-3 gap-3">
              <div className="win-fieldset p-2">
                <legend className="win-legend text-[#000080] font-bold">News &amp; Weather</legend>
                <ul className="space-y-1 text-[11px]">
                  <li>• <a href="#today" onClick={() => navigateTo('about:welcome')} className="text-blue-800 underline">Today's Top Headlines</a></li>
                  <li>• <a href="#weather" onClick={() => navigateTo('about:home')} className="text-blue-800 underline">Local 5-Day Forecast</a></li>
                  <li>• <a href="#tech" onClick={() => navigateTo('about:system')} className="text-blue-800 underline">Technology Today</a></li>
                </ul>
              </div>

              <div className="win-fieldset p-2">
                <legend className="win-legend text-[#000080] font-bold">Entertainment</legend>
                <ul className="space-y-1 text-[11px]">
                  <li>• <a href="#arcade" onClick={() => navigateTo('about:games')} className="text-blue-800 underline">Retro Arcade</a></li>
                  <li>• <a href="#music" onClick={() => navigateTo('about:welcome')} className="text-blue-800 underline">Music Chart Toppers</a></li>
                  <li>• <a href="#movies" onClick={() => navigateTo('about:home')} className="text-blue-800 underline">Box Office Hits</a></li>
                </ul>
              </div>

              <div className="win-fieldset p-2">
                <legend className="win-legend text-[#000080] font-bold">Web Directory</legend>
                <ul className="space-y-1 text-[11px]">
                  <li>• <a href="#wiki" onClick={() => navigateTo('https://wikipedia.org')} className="text-blue-800 underline">The Free Encyclopedia</a></li>
                  <li>• <a href="#archive" onClick={() => navigateTo('https://archive.org')} className="text-blue-800 underline">Internet Archive</a></li>
                  <li>• <a href="#help" onClick={() => navigateTo('about:help')} className="text-blue-800 underline">Internet Tutorial</a></li>
                </ul>
              </div>
            </div>
          </div>
        ) : currentUrl === 'about:welcome' ? (
          <div className="max-w-2xl mx-auto flex flex-col space-y-3">
            <h1 className="text-[18px] font-bold text-[#000080] border-b pb-1">Welcome to Windows 98 Internet Start</h1>
            <p className="leading-relaxed">
              With Microsoft Internet Explorer, the World Wide Web is always at your fingertips.
            </p>
            <div className="win-outset p-3 bg-[#ffffd0]">
              <span className="font-bold">Did you know?</span>
              <p className="mt-1">
                You can drag links straight from this browser window to your desktop to create web shortcuts!
              </p>
            </div>
          </div>
        ) : currentUrl === 'about:games' ? (
          <div className="max-w-2xl mx-auto flex flex-col space-y-3">
            <h1 className="text-[18px] font-bold text-[#000080] border-b pb-1">Retro Web Arcade</h1>
            <p>Enjoy classic built-in entertainment directly in Web Windows 98:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="win-outset p-3 bg-[#e8eef7]">
                <span className="font-bold text-[#000080]">Minesweeper</span>
                <p className="text-[10px] text-gray-600 mt-1">Clear the minefield without exploding a bomb!</p>
              </div>
              <div className="win-outset p-3 bg-[#e8eef7]">
                <span className="font-bold text-[#000080]">Paint Studio</span>
                <p className="text-[10px] text-gray-600 mt-1">Create and save retro bitmap drawings!</p>
              </div>
            </div>
          </div>
        ) : currentUrl === 'about:help' ? (
          <div className="max-w-2xl mx-auto flex flex-col space-y-3">
            <h1 className="text-[18px] font-bold text-[#000080] border-b pb-1">Internet Explorer Help</h1>
            <p>Here is how to get the most out of your web browsing experience:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Type any web address (e.g. wikipedia.org) into the Address Bar and press Enter.</li>
              <li>Use the Back and Forward buttons to navigate through your browsing history.</li>
              <li>Click Home to return to the MSN Internet Start portal.</li>
            </ul>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col">
            <iframe
              src={currentUrl}
              title="Browser Viewport"
              className="w-full flex-1 border-none"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
            <div className="mt-2 p-2 win-outset bg-[#ffffd0] text-[10px] flex justify-between items-center">
              <span>If this external website does not display due to modern browser CSP security policies:</span>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-800 underline font-bold"
              >
                Open in new browser tab ↗
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5 min-w-[120px]">
          {isLoading ? 'Opening page...' : 'Done'}
        </div>
        <div className="win-inset-shallow px-2 py-0.5 flex items-center space-x-1">
          <RetroIcon name="internet-explorer" size={12} />
          <span>Internet zone</span>
        </div>
      </div>
    </div>
  );
};

