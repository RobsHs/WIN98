import React, { useState } from 'react';
import { RetroIcon } from '../../components/Icons/RetroIcons';
import { soundService } from '../../services/soundService';

interface HelpTopic {
  id: string;
  title: string;
  category: string;
  content: string;
}

const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'intro',
    title: 'Welcome to Web Windows 98',
    category: 'Getting Started',
    content: `<h3>Welcome to Web-Based Windows 98</h3>
<p>This desktop environment is an interactive simulation and reimplementation of Windows 98 running entirely within your web browser.</p>
<p>Key highlights:</p>
<ul>
  <li><b>Virtual Filesystem (VFS)</b>: Files you create, edit, or save in Notepad, Paint, Explorer, or Command Prompt are persisted in IndexedDB across browser reloads.</li>
  <li><b>Synthesized Retro Sounds</b>: Authentic startup, shutdown, errors, and click tones are generated in real-time using the Web Audio API.</li>
  <li><b>Window Management</b>: Move, resize in 8 directions, minimize, maximize, and switch tasks using <b>Alt + Tab</b>.</li>
</ul>`,
  },
  {
    id: 'desktop',
    title: 'Using the Desktop and Taskbar',
    category: 'Getting Started',
    content: `<h3>Desktop &amp; Taskbar Features</h3>
<p><b>Desktop:</b></p>
<ul>
  <li>Double-click any desktop icon to launch its associated application.</li>
  <li>Click and drag on the empty desktop background to create a <b>rubber-band marquee selection</b>.</li>
  <li>Drag icons to reposition them on the desktop grid.</li>
  <li>Right-click on the desktop to arrange icons, refresh, create new folders or text files, and open Display Properties.</li>
</ul>
<p><b>Taskbar:</b></p>
<ul>
  <li>Click the <b>Start</b> button to open the classic cascading Start Menu.</li>
  <li>Click running task buttons to minimize, focus, or restore windows.</li>
  <li>Double-click the clock in the system tray to open the Date/Time settings.</li>
  <li>Click the speaker icon in the tray to adjust system volume.</li>
</ul>`,
  },
  {
    id: 'explorer',
    title: 'Managing Files in File Explorer',
    category: 'Applications',
    content: `<h3>Windows File Explorer</h3>
<p>Use File Explorer to navigate the simulated directory hierarchy on your <b>C:</b> drive.</p>
<ul>
  <li><b>Navigation:</b> Use the Back (←), Forward (→), and Up (↑) buttons or type a path into the Address Bar.</li>
  <li><b>File Operations:</b> Select files to Cut, Copy, Paste, Delete, or Rename.</li>
  <li><b>Creating Items:</b> Right-click inside any folder to create a New Folder, Text Document, or Bitmap Image.</li>
  <li><b>Recycle Bin:</b> Deleted files are safely placed into the Recycle Bin, where they can be restored at any time.</li>
</ul>`,
  },
  {
    id: 'notepad',
    title: 'Writing Documents in Notepad',
    category: 'Applications',
    content: `<h3>Notepad Text Editor</h3>
<p>Notepad is a lightweight text editor with complete Virtual File System support.</p>
<ul>
  <li><b>Save (Ctrl+S):</b> Saves changes directly to the current file on the VFS.</li>
  <li><b>Save As:</b> Saves a new document into your chosen directory (such as <i>C:\\My Documents</i> or <i>C:\\Desktop</i>).</li>
  <li><b>Find (Ctrl+F):</b> Searches for text strings.</li>
  <li><b>Time/Date (F5):</b> Inserts the current timestamp into your document.</li>
  <li><b>Word Wrap:</b> Toggle automatic line wrapping under the Edit menu.</li>
</ul>`,
  },
  {
    id: 'paint',
    title: 'Creating Graphics with Paint',
    category: 'Applications',
    content: `<h3>Paint Drawing Studio</h3>
<p>Paint offers classic pixel tools for creating drawings and editing bitmaps.</p>
<ul>
  <li><b>Tools:</b> Pencil, Brush, Eraser, Flood Fill bucket, Color Picker eyedropper, Line, Rectangle, and Ellipse.</li>
  <li><b>16-Color Palette:</b> Left-click to select primary draw color; right-click to select secondary/fill color.</li>
  <li><b>Undo / Redo:</b> Easily step back through drawing actions.</li>
  <li><b>Save to VFS:</b> Save drawings as bitmap image files that appear in File Explorer and on your Desktop.</li>
</ul>`,
  },
  {
    id: 'cmd',
    title: 'MS-DOS Command Prompt Reference',
    category: 'Advanced',
    content: `<h3>MS-DOS Prompt Commands</h3>
<p>The command prompt connects directly to the Virtual File System. Supported commands include:</p>
<table border="1" cellpadding="4" style="border-collapse: collapse; width: 100%; font-size: 11px;">
  <tr style="background:#dfdfdf;"><th>Command</th><th>Description</th></tr>
  <tr><td><b>HELP</b></td><td>Lists all supported commands</td></tr>
  <tr><td><b>DIR</b></td><td>Displays files and subdirectories with sizes</td></tr>
  <tr><td><b>CD [path]</b></td><td>Changes current directory (e.g. <i>CD WINDOWS</i>, <i>CD ..</i>)</td></tr>
  <tr><td><b>TYPE [file]</b></td><td>Displays the contents of a text file</td></tr>
  <tr><td><b>ECHO [text] &gt; [file]</b></td><td>Creates or overwrites a text file with string</td></tr>
  <tr><td><b>MKDIR / MD [name]</b></td><td>Creates a new folder</td></tr>
  <tr><td><b>RMDIR / RD [name]</b></td><td>Removes a folder</td></tr>
  <tr><td><b>DEL [file]</b></td><td>Deletes a file</td></tr>
  <tr><td><b>REN [old] [new]</b></td><td>Renames a file or folder</td></tr>
  <tr><td><b>TREE</b></td><td>Prints graphical folder structure</td></tr>
  <tr><td><b>CLS</b></td><td>Clears the terminal screen</td></tr>
  <tr><td><b>VER</b></td><td>Displays the Windows version string</td></tr>
</table>`,
  },
  {
    id: 'shortcuts',
    title: 'Keyboard Shortcuts Reference',
    category: 'Reference',
    content: `<h3>Global Keyboard Shortcuts</h3>
<table border="1" cellpadding="4" style="border-collapse: collapse; width: 100%; font-size: 11px;">
  <tr style="background:#dfdfdf;"><th>Shortcut</th><th>Action</th></tr>
  <tr><td><b>Alt + Tab</b></td><td>Interactive running application switcher</td></tr>
  <tr><td><b>Win + R</b> (or Start &rarr; Run)</td><td>Open Run dialog</td></tr>
  <tr><td><b>Win + E</b></td><td>Open Windows File Explorer</td></tr>
  <tr><td><b>Ctrl + S</b></td><td>Save document in Notepad</td></tr>
  <tr><td><b>Ctrl + F</b></td><td>Find text in Notepad</td></tr>
  <tr><td><b>F5</b></td><td>Insert Time/Date in Notepad; Refresh</td></tr>
  <tr><td><b>Alt + F4</b></td><td>Close active window</td></tr>
  <tr><td><b>Escape</b></td><td>Dismiss Start Menu, context menus, and dialogs</td></tr>
</table>`,
  },
];

export const WindowsHelp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'contents' | 'search'>('contents');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('intro');
  const [searchQuery, setSearchQuery] = useState('');

  const currentTopic = HELP_TOPICS.find((t) => t.id === selectedTopicId) || HELP_TOPICS[0];

  const filteredTopics = searchQuery.trim()
    ? HELP_TOPICS.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : HELP_TOPICS;

  return (
    <div className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center space-x-2 p-1 border-b border-[#808080] bg-[#c0c0c0]">
        <button
          className="win-btn px-2 h-[22px] flex items-center space-x-1"
          onClick={() => {
            soundService.playClick();
            setSelectedTopicId('intro');
          }}
        >
          <span>⌂</span>
          <span>Home</span>
        </button>
        <button className="win-btn px-2 h-[22px]" onClick={() => window.print()}>
          🖶 Print Topic
        </button>
      </div>

      {/* Main Split View: Left Navigation Pane + Right Topic Reader */}
      <div className="flex-1 flex overflow-hidden win-inset bg-white p-1">
        {/* Left Navigation Pane */}
        <div className="w-[200px] border-r border-[#808080] flex flex-col p-1 bg-[#f0f0f0]">
          {/* Tabs */}
          <div className="flex border-b border-[#808080] mb-2">
            <button
              className={`flex-1 py-1 text-center font-bold ${
                activeTab === 'contents' ? 'bg-[#c0c0c0] win-outset-shallow' : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('contents')}
            >
              Contents
            </button>
            <button
              className={`flex-1 py-1 text-center font-bold ${
                activeTab === 'search' ? 'bg-[#c0c0c0] win-outset-shallow' : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab('search')}
            >
              Search
            </button>
          </div>

          {activeTab === 'search' && (
            <div className="mb-2">
              <input
                type="text"
                className="win-input w-full text-[11px] py-0.5 px-1"
                placeholder="Type query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}

          {/* Topics List */}
          <div className="flex-1 win-inset bg-white overflow-y-auto p-1 text-[11px]">
            {filteredTopics.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              return (
                <div
                  key={topic.id}
                  className={`flex items-center space-x-1.5 px-1.5 py-1 cursor-default ${
                    isSelected ? 'bg-[#000080] text-white font-bold' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    soundService.playClick();
                    setSelectedTopicId(topic.id);
                  }}
                >
                  <RetroIcon name="help" size={14} />
                  <span className="truncate">{topic.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Help Article Content */}
        <div className="flex-1 p-4 overflow-y-auto select-text font-sans text-[12px] leading-relaxed text-black">
          <div dangerouslySetInnerHTML={{ __html: currentTopic.content }} />
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5">{currentTopic.title}</div>
      </div>
    </div>
  );
};

