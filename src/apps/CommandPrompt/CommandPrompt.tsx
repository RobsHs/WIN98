import React, { useState, useEffect, useRef } from 'react';
import { useFileSystem } from '../../context/FileSystemContext';
import { useWindowManager } from '../../context/WindowManagerContext';

interface CommandPromptProps {
  windowId?: string;
}

export const CommandPrompt: React.FC<CommandPromptProps> = ({ windowId }) => {
  const {
    fsState,
    getNodeByPath,
    getChildren,
    createFile,
    createFolder,
    deleteNode,
    renameNode,
    copyNode,
    moveNode,
  } = useFileSystem();

  const { closeWindow } = useWindowManager();

  const [currentPath, setCurrentPath] = useState<string>('C:');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [inputVal, setInputVal] = useState<string>('');
  const [outputLines, setOutputLines] = useState<string[]>([
    'Microsoft(R) Windows 98',
    '   (C)Copyright Microsoft Corp 1981-1998.',
    '',
    'Type HELP for a list of supported MS-DOS commands.',
    '',
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputLines]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) {
      setOutputLines((prev) => [...prev, `${currentPath}>`]);
      return;
    }

    setHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    const fullPrompt = `${currentPath}>${rawCmd}`;
    const linesToAdd: string[] = [fullPrompt];

    executeCommand(rawCmd, linesToAdd);

    setOutputLines((prev) => [...prev, ...linesToAdd]);
    setInputVal('');
  };

  const executeCommand = (cmdStr: string, out: string[]) => {
    const parts = cmdStr.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    const argStr = args.join(' ').trim();

    const currentNode = getNodeByPath(currentPath) || getNodeByPath('C:');

    switch (cmd) {
      case 'help':
        out.push(
          'Supported MS-DOS Commands:',
          '  CD [path]          - Changes current directory (e.g. CD WINDOWS, CD ..)',
          '  DIR                - Displays files and folders in directory',
          '  TYPE [file]        - Displays contents of a text file',
          '  ECHO [text] > file - Writes text to file or screen',
          '  MKDIR / MD [name]  - Creates a new directory',
          '  RMDIR / RD [name]  - Removes a directory',
          '  DEL [file]         - Deletes a file',
          '  COPY [src] [dst]   - Copies a file',
          '  MOVE [src] [dst]   - Moves a file',
          '  REN [old] [new]    - Renames a file or folder',
          '  TREE               - Graphically displays folder structure',
          '  CLS                - Clears the screen',
          '  VER                - Displays Windows version',
          '  DATE / TIME        - Displays system date/time',
          '  EXIT               - Closes MS-DOS Prompt'
        );
        break;

      case 'cls':
        setOutputLines([]);
        return;

      case 'ver':
        out.push('Microsoft Windows 98 [Version 4.10.1998]');
        break;

      case 'date':
        out.push(`Current date is ${new Date().toLocaleDateString()}`);
        break;

      case 'time':
        out.push(`Current time is ${new Date().toLocaleTimeString()}`);
        break;

      case 'exit':
        if (windowId) closeWindow(windowId);
        break;

      case 'cd..':
      case 'cd':
        if (cmd === 'cd..' || argStr === '..') {
          if (currentNode && currentNode.parentId) {
            const parent = fsState.nodes[currentNode.parentId];
            if (parent) setCurrentPath(parent.path);
          }
        } else if (argStr === '\\' || argStr === '/') {
          setCurrentPath('C:');
        } else if (argStr) {
          const targetPath = argStr.startsWith('C:')
            ? argStr
            : currentPath === 'C:'
            ? `C:\\${argStr}`
            : `${currentPath}\\${argStr}`;
          const targetNode = getNodeByPath(targetPath);
          if (targetNode && targetNode.type === 'folder') {
            setCurrentPath(targetNode.path);
          } else {
            out.push('Invalid directory');
          }
        } else {
          out.push(currentPath);
        }
        break;

      case 'dir':
        if (currentNode) {
          const children = getChildren(currentNode.id);
          out.push(
            ` Volume in drive C has no label`,
            ` Directory of ${currentPath}`,
            ''
          );
          out.push(' .              <DIR>        09-02-98 12:00p');
          out.push(' ..             <DIR>        09-02-98 12:00p');

          let fileCount = 0;
          let dirCount = 0;
          let totalBytes = 0;

          children.forEach((child) => {
            const isDir = child.type === 'folder';
            if (isDir) dirCount++;
            else {
              fileCount++;
              totalBytes += child.size;
            }
            const dateStr = new Date(child.modifiedAt).toLocaleDateString();
            const timeStr = new Date(child.modifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const typeStr = isDir ? '<DIR>       ' : child.size.toString().padStart(12, ' ');
            out.push(` ${child.name.padEnd(20, ' ')} ${typeStr}  ${dateStr}  ${timeStr}`);
          });

          out.push(
            `         ${fileCount} file(s)       ${totalBytes} bytes`,
            `         ${dirCount + 2} dir(s)   7,842,125,824 bytes free`
          );
        }
        break;

      case 'type':
        if (!argStr) {
          out.push('Required parameter missing');
        } else if (currentNode) {
          const file = getChildren(currentNode.id).find(
            (c) => c.name.toUpperCase() === argStr.toUpperCase() && c.type === 'file'
          );
          if (file) {
            out.push(file.content || '');
          } else {
            out.push(`File not found - ${argStr}`);
          }
        }
        break;

      case 'echo':
        if (argStr.includes('>')) {
          const [text, filename] = argStr.split('>');
          const cleanText = text.trim();
          const cleanFile = filename.trim();
          if (currentNode && cleanFile) {
            createFile(currentNode.id, cleanFile, cleanText, 'txt');
            out.push(`Written to ${cleanFile}`);
          }
        } else {
          out.push(argStr);
        }
        break;

      case 'mkdir':
      case 'md':
        if (!argStr) {
          out.push('Required parameter missing');
        } else if (currentNode) {
          const created = createFolder(currentNode.id, argStr);
          if (!created) out.push(`Directory already exists or invalid name: ${argStr}`);
        }
        break;

      case 'rmdir':
      case 'rd':
        if (!argStr) {
          out.push('Required parameter missing');
        } else if (currentNode) {
          const target = getChildren(currentNode.id).find(
            (c) => c.name.toUpperCase() === argStr.toUpperCase() && c.type === 'folder'
          );
          if (target) {
            deleteNode(target.id, true);
          } else {
            out.push(`Directory not found - ${argStr}`);
          }
        }
        break;

      case 'del':
      case 'erase':
        if (!argStr) {
          out.push('Required parameter missing');
        } else if (currentNode) {
          const target = getChildren(currentNode.id).find(
            (c) => c.name.toUpperCase() === argStr.toUpperCase() && c.type === 'file'
          );
          if (target) {
            deleteNode(target.id, true);
          } else {
            out.push(`File not found - ${argStr}`);
          }
        }
        break;

      case 'copy':
        if (args.length < 2) {
          out.push('The syntax of the command is incorrect.');
        } else if (currentNode) {
          const srcName = args[0];
          const dstName = args[1];
          const src = getChildren(currentNode.id).find((c) => c.name.toUpperCase() === srcName.toUpperCase());
          if (src) {
            const targetFolder = getNodeByPath(dstName) || currentNode;
            copyNode(src.id, targetFolder.id);
            out.push(`        1 file(s) copied.`);
          } else {
            out.push(`File not found - ${srcName}`);
          }
        }
        break;

      case 'move':
        if (args.length < 2) {
          out.push('The syntax of the command is incorrect.');
        } else if (currentNode) {
          const srcName = args[0];
          const dstFolder = args[1];
          const src = getChildren(currentNode.id).find((c) => c.name.toUpperCase() === srcName.toUpperCase());
          const targetFolder = getNodeByPath(dstFolder);
          if (src && targetFolder) {
            moveNode(src.id, targetFolder.id);
            out.push(`        1 file(s) moved.`);
          } else {
            out.push(`Cannot find source file or destination folder.`);
          }
        }
        break;

      case 'ren':
      case 'rename':
        if (args.length < 2) {
          out.push('The syntax of the command is incorrect.');
        } else if (currentNode) {
          const oldName = args[0];
          const newName = args[1];
          const target = getChildren(currentNode.id).find(
            (c) => c.name.toUpperCase() === oldName.toUpperCase()
          );
          if (target) {
            renameNode(target.id, newName);
          } else {
            out.push(`File not found - ${oldName}`);
          }
        }
        break;

      case 'tree':
        out.push(`Folder PATH listing for Volume C:`);
        out.push('C:.');
        printTreeRecursive('node_root', '   ', out);
        break;

      default:
        out.push(`Bad command or file name: "${cmd}"`);
    }
  };

  const printTreeRecursive = (parentId: string, prefix: string, out: string[]) => {
    const children = getChildren(parentId).filter((c) => c.type === 'folder');
    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      out.push(`${prefix}${isLast ? '└── ' : '├── '}${child.name}`);
      printTreeRecursive(child.id, prefix + (isLast ? '    ' : '│   '), out);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      if (history.length > 0 && historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < history.length) {
          setHistoryIndex(nextIdx);
          setInputVal(history[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal('');
        }
      }
    }
  };

  return (
    <div
      className="flex-1 flex flex-col bg-black text-white font-mono text-[12px] p-2 overflow-y-auto select-text leading-tight"
      onClick={() => inputRef.current?.focus()}
    >
      {outputLines.map((line, idx) => (
        <div key={idx} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}

      {/* Active prompt row */}
      <form onSubmit={handleCommandSubmit} className="flex items-center">
        <span className="text-white select-none whitespace-pre">{currentPath}&gt;</span>
        <input
          ref={inputRef}
          type="text"
          autoFocus
          className="flex-1 bg-transparent text-white font-mono text-[12px] border-none outline-none ml-1 caret-white"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </form>
      <div ref={terminalEndRef} />
    </div>
  );
};

