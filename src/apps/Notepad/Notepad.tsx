import React, { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useDialog } from '../../context/DialogContext';
import { soundService } from '../../services/soundService';

interface NotepadProps {
  filePath?: string;
  windowId?: string;
}

export const Notepad: React.FC<NotepadProps> = ({ filePath, windowId }) => {
  const { readFile, writeFile, createFile } = useFileSystem();
  const { closeWindow, setWindowTitle } = useWindowManager();
  const { showInfo, showConfirm, showError } = useDialog();

  const [currentFilePath, setCurrentFilePath] = useState<string | null>(filePath || null);
  const [content, setContent] = useState<string>('');
  const [initialContent, setInitialContent] = useState<string>('');
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [showFindModal, setShowFindModal] = useState<boolean>(false);
  const [findQuery, setFindQuery] = useState<string>('');
  const [showSaveAsModal, setShowSaveAsModal] = useState<boolean>(false);
  const [saveAsFileName, setSaveAsFileName] = useState<string>('Untitled.txt');
  const [saveAsFolder, setSaveAsFolder] = useState<string>('C:\\My Documents');

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDirty = content !== initialContent;

  // Load initial file if provided
  useEffect(() => {
    if (filePath) {
      const fileData = readFile(filePath);
      if (fileData !== null) {
        setContent(fileData);
        setInitialContent(fileData);
        setCurrentFilePath(filePath);
        const fileName = filePath.split('\\').pop() || 'Untitled';
        if (windowId) setWindowTitle(windowId, `${fileName} - Notepad`);
      }
    }
  }, [filePath, readFile, windowId, setWindowTitle]);

  // Update title with dirty indicator
  useEffect(() => {
    if (windowId) {
      const fileName = currentFilePath ? currentFilePath.split('\\').pop() : 'Untitled';
      setWindowTitle(windowId, `${isDirty ? '*' : ''}${fileName} - Notepad`);
    }
  }, [isDirty, currentFilePath, windowId, setWindowTitle]);

  // Handle cursor position tracking
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    updateCursor(e.target);
  };

  const updateCursor = (el: HTMLTextAreaElement) => {
    const textBefore = el.value.substring(0, el.selectionStart);
    const lines = textBefore.split('\n');
    setCursorPos({
      line: lines.length,
      col: lines[lines.length - 1].length + 1,
    });
  };

  const handleSave = () => {
    soundService.playClick();
    if (currentFilePath) {
      const success = writeFile(currentFilePath, content);
      if (success) {
        setInitialContent(content);
        showInfo('File saved successfully.', 'Notepad');
      } else {
        showError('Failed to save file.', 'Notepad');
      }
    } else {
      setShowSaveAsModal(true);
    }
  };

  const handleSaveAsSubmit = () => {
    soundService.playClick();
    if (!saveAsFileName.trim()) return;

    const node = createFile(saveAsFolder, saveAsFileName.trim(), content, 'txt');
    if (node) {
      setCurrentFilePath(node.path);
      setInitialContent(content);
      setShowSaveAsModal(false);
      showInfo(`File saved to ${node.path}`, 'Notepad');
    } else {
      showError('Could not save file. Folder not found or invalid name.', 'Notepad');
    }
  };

  const handleNew = () => {
    soundService.playClick();
    if (isDirty) {
      showConfirm(
        'The text in this file has changed. Do you want to save the changes?',
        () => {
          handleSave();
          setContent('');
          setInitialContent('');
          setCurrentFilePath(null);
        },
        () => {
          setContent('');
          setInitialContent('');
          setCurrentFilePath(null);
        },
        'Notepad'
      );
    } else {
      setContent('');
      setInitialContent('');
      setCurrentFilePath(null);
    }
  };

  const handleInsertDate = () => {
    soundService.playClick();
    const now = new Date();
    const timeStr = now.toLocaleTimeString() + ' ' + now.toLocaleDateString();
    const el = textareaRef.current;
    if (el) {
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newText = content.substring(0, start) + timeStr + content.substring(end);
      setContent(newText);
    }
  };

  const handleFind = () => {
    if (!findQuery || !textareaRef.current) return;
    const el = textareaRef.current;
    const text = el.value.toLowerCase();
    const idx = text.indexOf(findQuery.toLowerCase(), el.selectionEnd);
    if (idx !== -1) {
      el.focus();
      el.setSelectionRange(idx, idx + findQuery.length);
    } else {
      const startIdx = text.indexOf(findQuery.toLowerCase(), 0);
      if (startIdx !== -1) {
        el.focus();
        el.setSelectionRange(startIdx, startIdx + findQuery.length);
      } else {
        showInfo(`Cannot find "${findQuery}"`, 'Notepad');
      }
    }
  };

  // Keyboard shortcut listener for Ctrl+S, Ctrl+F, F5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setShowFindModal(true);
      } else if (e.key === 'F5') {
        e.preventDefault();
        handleInsertDate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, currentFilePath]);

  return (
    <div
      className="flex-1 flex flex-col bg-[#c0c0c0] select-none text-[11px] overflow-hidden"
      onClick={() => setActiveMenu(null)}
    >
      {/* Menu Bar */}
      <div className="flex items-center space-x-1 px-1 py-0.5 border-b border-[#808080] bg-[#c0c0c0]">
        {/* File Menu */}
        <div className="relative">
          <button
            className={`px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default ${
              activeMenu === 'file' ? 'bg-[#000080] text-white' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'file' ? null : 'file');
            }}
          >
            <u>F</u>ile
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full win-outset py-1 w-[150px] shadow-lg bg-[#c0c0c0] text-black z-50">
              <div className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between" onClick={handleNew}>
                <span><u>N</u>ew</span>
                <span className="text-[9px] opacity-70">Ctrl+N</span>
              </div>
              <div className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between" onClick={() => setShowSaveAsModal(true)}>
                <span><u>O</u>pen...</span>
                <span className="text-[9px] opacity-70">Ctrl+O</span>
              </div>
              <div className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between" onClick={handleSave}>
                <span><u>S</u>ave</span>
                <span className="text-[9px] opacity-70">Ctrl+S</span>
              </div>
              <div className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default" onClick={() => setShowSaveAsModal(true)}>
                <span>Save <u>A</u>s...</span>
              </div>
              <div className="my-1 border-t border-[#808080] border-b border-white" />
              <div className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between" onClick={() => window.print()}>
                <span><u>P</u>rint...</span>
                <span className="text-[9px] opacity-70">Ctrl+P</span>
              </div>
              <div className="my-1 border-t border-[#808080] border-b border-white" />
              <div className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default" onClick={() => windowId && closeWindow(windowId)}>
                <span>E<u>x</u>it</span>
              </div>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <button
            className={`px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default ${
              activeMenu === 'edit' ? 'bg-[#000080] text-white' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'edit' ? null : 'edit');
            }}
          >
            <u>E</u>dit
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute left-0 top-full win-outset py-1 w-[160px] shadow-lg bg-[#c0c0c0] text-black z-50">
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between"
                onClick={() => {
                  soundService.playClick();
                  document.execCommand('undo');
                }}
              >
                <span><u>U</u>ndo</span>
                <span className="text-[9px] opacity-70">Ctrl+Z</span>
              </div>
              <div className="my-1 border-t border-[#808080] border-b border-white" />
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between"
                onClick={() => {
                  soundService.playClick();
                  document.execCommand('cut');
                }}
              >
                <span>Cu<u>t</u></span>
                <span className="text-[9px] opacity-70">Ctrl+X</span>
              </div>
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between"
                onClick={() => {
                  soundService.playClick();
                  document.execCommand('copy');
                }}
              >
                <span><u>C</u>opy</span>
                <span className="text-[9px] opacity-70">Ctrl+C</span>
              </div>
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between"
                onClick={() => {
                  soundService.playClick();
                  document.execCommand('paste');
                }}
              >
                <span><u>P</u>aste</span>
                <span className="text-[9px] opacity-70">Ctrl+V</span>
              </div>
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => {
                  soundService.playClick();
                  document.execCommand('delete');
                }}
              >
                <span><u>D</u>elete</span>
              </div>
              <div className="my-1 border-t border-[#808080] border-b border-white" />
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between"
                onClick={() => setShowFindModal(true)}
              >
                <span><u>F</u>ind...</span>
                <span className="text-[9px] opacity-70">Ctrl+F</span>
              </div>
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between"
                onClick={() => {
                  if (textareaRef.current) textareaRef.current.select();
                }}
              >
                <span>Select <u>A</u>ll</span>
                <span className="text-[9px] opacity-70">Ctrl+A</span>
              </div>
              <div className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex justify-between" onClick={handleInsertDate}>
                <span>Time/<u>D</u>ate</span>
                <span className="text-[9px] opacity-70">F5</span>
              </div>
              <div className="my-1 border-t border-[#808080] border-b border-white" />
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default flex items-center space-x-2"
                onClick={() => setWordWrap((prev) => !prev)}
              >
                <span className="w-3 font-bold">{wordWrap ? '✓' : ''}</span>
                <span><u>W</u>ord Wrap</span>
              </div>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative">
          <button
            className={`px-1.5 py-0.5 hover:bg-[#000080] hover:text-white cursor-default ${
              activeMenu === 'help' ? 'bg-[#000080] text-white' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'help' ? null : 'help');
            }}
          >
            <u>H</u>elp
          </button>
          {activeMenu === 'help' && (
            <div className="absolute left-0 top-full win-outset py-1 w-[140px] shadow-lg bg-[#c0c0c0] text-black z-50">
              <div
                className="px-3 py-1 hover:bg-[#000080] hover:text-white cursor-default"
                onClick={() => showInfo('Notepad for Web Windows 98.\nVersion 1.0\nCreated with React & TypeScript.', 'About Notepad')}
              >
                <span><u>A</u>bout Notepad</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Text Editor Area */}
      <div className="flex-1 win-inset p-0 overflow-hidden relative">
        <textarea
          ref={textareaRef}
          className={`w-full h-full win-textarea-mono p-2 outline-none border-none resize-none bg-white text-black ${
            wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto'
          }`}
          value={content}
          onChange={handleTextChange}
          onKeyUp={(e) => updateCursor(e.currentTarget)}
          onClick={(e) => updateCursor(e.currentTarget)}
          autoFocus
          spellCheck={false}
        />
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-2 py-0.5 border-t border-[#808080] bg-[#c0c0c0] text-[10px] text-[#404040]">
        <div className="win-inset-shallow px-2 py-0.5 min-w-[120px]">
          {currentFilePath ? currentFilePath : 'Untitled'}
        </div>
        <div className="win-inset-shallow px-2 py-0.5">
          Ln {cursorPos.line}, Col {cursorPos.col}
        </div>
      </div>

      {/* Find Modal */}
      {showFindModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-20">
          <div className="win-outset w-[320px] p-2 bg-[#c0c0c0] shadow-2xl flex flex-col space-y-3">
            <div className="win-titlebar active flex justify-between items-center">
              <span>Find</span>
              <button className="win-titlebar-btn" onClick={() => setShowFindModal(false)}>✕</button>
            </div>
            <div className="flex items-center space-x-2">
              <label><u>F</u>ind what:</label>
              <input
                type="text"
                autoFocus
                className="win-input flex-1"
                value={findQuery}
                onChange={(e) => setFindQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFind()}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button className="win-btn font-bold px-3" onClick={handleFind}>Find Next</button>
              <button className="win-btn px-3" onClick={() => setShowFindModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Save As Modal */}
      {showSaveAsModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-20">
          <div className="win-outset w-[380px] p-2 bg-[#c0c0c0] shadow-2xl flex flex-col space-y-3">
            <div className="win-titlebar active flex justify-between items-center">
              <span>Save As</span>
              <button className="win-titlebar-btn" onClick={() => setShowSaveAsModal(false)}>✕</button>
            </div>
            <div className="flex flex-col space-y-2 text-[11px]">
              <div className="flex items-center space-x-2">
                <span className="w-16">Save in:</span>
                <select
                  className="win-select flex-1"
                  value={saveAsFolder}
                  onChange={(e) => setSaveAsFolder(e.target.value)}
                >
                  <option value="C:\My Documents">C:\My Documents</option>
                  <option value="C:\Desktop">C:\Desktop</option>
                  <option value="C:\WINDOWS">C:\WINDOWS</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16">File name:</span>
                <input
                  type="text"
                  autoFocus
                  className="win-input flex-1"
                  value={saveAsFileName}
                  onChange={(e) => setSaveAsFileName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveAsSubmit()}
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-16">Save as type:</span>
                <select className="win-select flex-1" disabled>
                  <option>Text Documents (*.txt)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2 border-t border-[#808080]">
              <button className="win-btn font-bold px-4" onClick={handleSaveAsSubmit}>Save</button>
              <button className="win-btn px-4" onClick={() => setShowSaveAsModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

