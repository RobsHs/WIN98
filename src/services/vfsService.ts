import type { FileSystemState, VFSNode, DeletedItem } from '../types/filesystem';

const DB_NAME = 'Win98_VFS_DB';
const DB_VERSION = 1;
const STORE_NAME = 'filesystem_state';
const STATE_KEY = 'current_vfs';

// Helper to generate unique IDs
export const generateId = (): string => {
  return 'node_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
};

// Seed initial filesystem hierarchy
const createInitialFileSystem = (): FileSystemState => {
  const rootId = 'node_root';
  const nodes: Record<string, VFSNode> = {};

  const addFolder = (id: string, name: string, path: string, parentId: string | null, isSystem = false): VFSNode => {
    const node: VFSNode = {
      id,
      name,
      path,
      type: 'folder',
      parentId,
      createdAt: Date.now() - 10000000,
      modifiedAt: Date.now() - 10000000,
      size: 0,
      isSystem,
    };
    nodes[id] = node;
    return node;
  };

  const addFile = (
    id: string,
    name: string,
    path: string,
    parentId: string,
    content: string,
    extension: string,
    isSystem = false
  ): VFSNode => {
    const node: VFSNode = {
      id,
      name,
      path,
      type: 'file',
      parentId,
      createdAt: Date.now() - 5000000,
      modifiedAt: Date.now() - 5000000,
      size: content.length,
      content,
      extension: extension.toLowerCase(),
      isSystem,
    };
    nodes[id] = node;
    return node;
  };

  // Root C:\
  addFolder(rootId, 'C:', 'C:', null, true);

  // C:\WINDOWS and subfolders
  const winId = 'node_windows';
  addFolder(winId, 'WINDOWS', 'C:\\WINDOWS', rootId, true);
  addFolder('node_win_system', 'SYSTEM', 'C:\\WINDOWS\\SYSTEM', winId, true);
  addFolder('node_win_temp', 'TEMP', 'C:\\WINDOWS\\TEMP', winId, false);
  addFolder('node_win_help', 'HELP', 'C:\\WINDOWS\\HELP', winId, true);

  // C:\Program Files
  const progId = 'node_prog_files';
  addFolder(progId, 'Program Files', 'C:\\Program Files', rootId, true);
  addFolder('node_pf_ie', 'Internet Explorer', 'C:\\Program Files\\Internet Explorer', progId, true);
  addFolder('node_pf_wmp', 'Windows Media Player', 'C:\\Program Files\\Windows Media Player', progId, true);
  addFolder('node_pf_acc', 'Accessories', 'C:\\Program Files\\Accessories', progId, true);

  // C:\My Documents
  const myDocsId = 'node_my_docs';
  addFolder(myDocsId, 'My Documents', 'C:\\My Documents', rootId, false);

  // C:\Desktop (Storage for desktop items)
  const desktopId = 'node_desktop';
  addFolder(desktopId, 'Desktop', 'C:\\Desktop', rootId, true);

  // Initial System Files in C:\WINDOWS
  addFile(
    'node_file_sysini',
    'SYSTEM.INI',
    'C:\\WINDOWS\\SYSTEM.INI',
    winId,
    `[boot]\noemfonts.fon=vgasys.fon\n386grabber=vga.3gr\ndisplay.drv=pnpdrvr.drv\nmouse.drv=mouse.drv\nshell=Explorer.exe\n\n[drivers]\nwave=mmsystem.dll\ntimer=timer.drv\n`,
    'ini',
    true
  );

  addFile(
    'node_file_winini',
    'WIN.INI',
    'C:\\WINDOWS\\WIN.INI',
    winId,
    `[windows]\nload=\nrun=\nNullPort=None\nBeep=yes\nBorderWidth=3\nKeyboardSpeed=31\n\n[Desktop]\nPattern=(None)\nWallpaper=Setup.bmp\nTileWallpaper=0\n`,
    'ini',
    true
  );

  addFile(
    'node_file_notepad_exe',
    'NOTEPAD.EXE',
    'C:\\WINDOWS\\NOTEPAD.EXE',
    winId,
    '[BINARY EXECUTABLE - NOTEPAD APPLICATION]',
    'exe',
    true
  );

  addFile(
    'node_file_paint_exe',
    'PBRUSH.EXE',
    'C:\\WINDOWS\\PBRUSH.EXE',
    winId,
    '[BINARY EXECUTABLE - PAINT APPLICATION]',
    'exe',
    true
  );

  addFile(
    'node_file_calc_exe',
    'CALC.EXE',
    'C:\\WINDOWS\\CALC.EXE',
    winId,
    '[BINARY EXECUTABLE - CALCULATOR APPLICATION]',
    'exe',
    true
  );

  addFile(
    'node_file_cmd_exe',
    'COMMAND.COM',
    'C:\\WINDOWS\\COMMAND.COM',
    winId,
    '[BINARY EXECUTABLE - MS-DOS COMMAND INTERPRETER]',
    'com',
    true
  );

  // Sample Documents in C:\My Documents
  addFile(
    'node_file_welcome',
    'Welcome to Windows 98.txt',
    'C:\\My Documents\\Welcome to Windows 98.txt',
    myDocsId,
    `===================================================\n   WELCOME TO WEB-BASED WINDOWS 98 DESKTOP\n===================================================\n\nCongratulations on launching Web Windows 98!\n\nThis is a fully interactive, browser-based recreation of the classic Windows 98 operating environment.\n\nFeatures available:\n- Functional File Explorer with back/forward navigation and file operations\n- Notepad for viewing, creating, and saving text documents\n- Paint with full 16-color canvas tools and image export/save\n- Standard Calculator with arithmetic and memory keys\n- MS-DOS Command Prompt supporting dir, cd, mkdir, del, type, echo\n- Control Panel and Display Properties for wallpaper and theme customization\n- Retro Internet Explorer with offline portal pages\n- Windows Media Player with audio synth and custom file playback\n- Authentic Recycle Bin with file restoration\n- Full window manager with resize, minimize, maximize, and Alt+Tab\n\nAll changes you make to files and settings are persisted locally in your browser.\n\nEnjoy the nostalgic journey!\n`,
    'txt',
    false
  );

  addFile(
    'node_file_readme',
    'README.TXT',
    'C:\\My Documents\\README.TXT',
    myDocsId,
    `TIPS & TRICKS:\n- Press Alt+Tab to cycle through running applications.\n- Right-click on the Desktop to create new folders or text files.\n- Drag windows to reposition, or grab any corner/edge to resize.\n- Use the Command Prompt to manage your files via MS-DOS commands.\n- Drag files into the Recycle Bin or press Delete to move them.\n`,
    'txt',
    false
  );

  addFile(
    'node_file_todo',
    'TODO List.txt',
    'C:\\My Documents\\TODO List.txt',
    myDocsId,
    `THINGS TO DO TODAY:\n1. Play a game of Minesweeper\n2. Paint a pixel masterpiece in Paint\n3. Browse the retro web in Internet Explorer\n4. Change wallpaper in Control Panel -> Display\n5. Test DOS commands in Command Prompt\n`,
    'txt',
    false
  );

  // Sample Drawing data in C:\My Documents
  addFile(
    'node_file_sample_img',
    'Smile.bmp',
    'C:\\My Documents\\Smile.bmp',
    myDocsId,
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23ffff00"/><circle cx="20" cy="24" r="6" fill="%23000000"/><circle cx="44" cy="24" r="6" fill="%23000000"/><path d="M 16 40 Q 32 56 48 40" stroke="%23000000" stroke-width="6" fill="none" stroke-linecap="round"/></svg>',
    'bmp',
    false
  );

  return {
    nodes,
    rootId,
    recycleBin: [],
  };
};

class VFSService {
  private state: FileSystemState;
  private dbPromise: Promise<IDBDatabase | null>;
  private listeners: Array<() => void> = [];

  constructor() {
    this.state = createInitialFileSystem();
    this.dbPromise = this.initIndexedDB();
    this.loadState();
  }

  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e: any) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        req.onsuccess = (e: any) => resolve(e.target.result);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }

  private async loadState() {
    try {
      const db = await this.dbPromise;
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(STATE_KEY);
        req.onsuccess = () => {
          if (req.result && req.result.nodes && req.result.rootId) {
            this.state = req.result;
            this.notify();
          }
        };
      } else {
        const local = localStorage.getItem('win98_vfs_backup');
        if (local) {
          this.state = JSON.parse(local);
          this.notify();
        }
      }
    } catch (e) {
      console.warn('VFS load fallback to initial state', e);
    }
  }

  private async persistState() {
    try {
      const db = await this.dbPromise;
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(this.state, STATE_KEY);
      }
      localStorage.setItem('win98_vfs_backup', JSON.stringify(this.state));
    } catch (e) {
      console.warn('VFS persist error', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.persistState();
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('VFS listener error', e);
      }
    });
  }

  public getState(): FileSystemState {
    return this.state;
  }

  public getNodeById(id: string): VFSNode | null {
    return this.state.nodes[id] || null;
  }

  public getNodeByPath(path: string): VFSNode | null {
    const cleanPath = this.normalizePath(path);
    return (
      Object.values(this.state.nodes).find(
        (n) => n.path.toUpperCase() === cleanPath.toUpperCase()
      ) || null
    );
  }

  public getChildren(parentId: string): VFSNode[] {
    return Object.values(this.state.nodes).filter((n) => n.parentId === parentId);
  }

  public normalizePath(path: string): string {
    let p = path.trim().replace(/\//g, '\\');
    if (p.endsWith('\\') && p.length > 3) {
      p = p.slice(0, -1);
    }
    if (p === 'C:' || p === 'C:\\') return 'C:';
    if (!p.toUpperCase().startsWith('C:')) {
      if (p.startsWith('\\')) p = 'C:' + p;
      else p = 'C:\\' + p;
    }
    return p;
  }

  // Create new Folder
  public createFolder(parentPathOrId: string, folderName: string, isSystem = false): VFSNode | null {
    let parentNode: VFSNode | null = null;
    if (this.state.nodes[parentPathOrId]) {
      parentNode = this.state.nodes[parentPathOrId];
    } else {
      parentNode = this.getNodeByPath(parentPathOrId);
    }

    if (!parentNode || parentNode.type !== 'folder') {
      return null;
    }

    // Check duplicate name
    const existing = this.getChildren(parentNode.id).find(
      (child) => child.name.toUpperCase() === folderName.toUpperCase()
    );
    if (existing) {
      return null;
    }

    const newId = generateId();
    const newPath = parentNode.path === 'C:' ? `C:\\${folderName}` : `${parentNode.path}\\${folderName}`;
    const newNode: VFSNode = {
      id: newId,
      name: folderName,
      path: newPath,
      type: 'folder',
      parentId: parentNode.id,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      size: 0,
      isSystem,
    };

    this.state.nodes[newId] = newNode;
    this.notify();
    return newNode;
  }

  // Create or Write File
  public createFile(
    parentPathOrId: string,
    fileName: string,
    content: string = '',
    extension?: string,
    isSystem = false
  ): VFSNode | null {
    let parentNode: VFSNode | null = null;
    if (this.state.nodes[parentPathOrId]) {
      parentNode = this.state.nodes[parentPathOrId];
    } else {
      parentNode = this.getNodeByPath(parentPathOrId);
    }

    if (!parentNode || parentNode.type !== 'folder') {
      return null;
    }

    const parts = fileName.split('.');
    const ext = extension || (parts.length > 1 ? parts.pop()?.toLowerCase() : 'txt') || 'txt';
    const finalName = fileName.includes('.') ? fileName : `${fileName}.${ext}`;

    // If file with same name already exists in this folder, overwrite it
    const existing = this.getChildren(parentNode.id).find(
      (child) => child.name.toUpperCase() === finalName.toUpperCase() && child.type === 'file'
    );

    if (existing) {
      existing.content = content;
      existing.size = content.length;
      existing.modifiedAt = Date.now();
      this.notify();
      return existing;
    }

    const newId = generateId();
    const newPath = parentNode.path === 'C:' ? `C:\\${finalName}` : `${parentNode.path}\\${finalName}`;
    const newNode: VFSNode = {
      id: newId,
      name: finalName,
      path: newPath,
      type: 'file',
      parentId: parentNode.id,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      size: content.length,
      content,
      extension: ext,
      isSystem,
    };

    this.state.nodes[newId] = newNode;
    this.notify();
    return newNode;
  }

  // Read file content
  public readFile(pathOrId: string): string | null {
    const node = this.state.nodes[pathOrId] || this.getNodeByPath(pathOrId);
    if (!node || node.type !== 'file') return null;
    return node.content ?? '';
  }

  // Write content to existing file
  public writeFile(pathOrId: string, content: string): boolean {
    const node = this.state.nodes[pathOrId] || this.getNodeByPath(pathOrId);
    if (!node || node.type !== 'file') return false;

    node.content = content;
    node.size = content.length;
    node.modifiedAt = Date.now();
    this.notify();
    return true;
  }

  // Rename node
  public renameNode(nodeId: string, newName: string): boolean {
    const node = this.state.nodes[nodeId];
    if (!node || node.id === this.state.rootId) return false;
    if (node.isSystem) return false;

    const parentNode = node.parentId ? this.state.nodes[node.parentId] : null;
    if (!parentNode) return false;

    // Check sibling duplicate name
    const siblingConflict = this.getChildren(parentNode.id).find(
      (s) => s.id !== nodeId && s.name.toUpperCase() === newName.toUpperCase()
    );
    if (siblingConflict) return false;

    const oldPath = node.path;
    node.name = newName;
    if (node.type === 'file' && newName.includes('.')) {
      node.extension = newName.split('.').pop()?.toLowerCase();
    }
    node.path = parentNode.path === 'C:' ? `C:\\${newName}` : `${parentNode.path}\\${newName}`;
    node.modifiedAt = Date.now();

    if (node.type === 'folder') {
      this.updateChildPaths(node.id, oldPath, node.path);
    }

    this.notify();
    return true;
  }

  private updateChildPaths(folderId: string, oldParentPath: string, newParentPath: string) {
    const children = this.getChildren(folderId);
    children.forEach((child) => {
      child.path = child.path.replace(oldParentPath, newParentPath);
      if (child.type === 'folder') {
        this.updateChildPaths(child.id, oldParentPath, newParentPath);
      }
    });
  }

  // Delete node
  public deleteNode(nodeId: string, permanent: boolean = false): boolean {
    const node = this.state.nodes[nodeId];
    if (!node || node.id === this.state.rootId) return false;
    if (node.isSystem && !permanent) return false;

    if (!permanent) {
      const deletedItem: DeletedItem = {
        id: generateId(),
        node: JSON.parse(JSON.stringify(node)),
        originalPath: node.path,
        deletedAt: Date.now(),
      };
      this.state.recycleBin.push(deletedItem);
    }

    if (node.type === 'folder') {
      const children = this.getChildren(node.id);
      children.forEach((c) => this.deleteNode(c.id, true));
    }

    delete this.state.nodes[nodeId];
    this.notify();
    return true;
  }

  // Restore deleted item from Recycle Bin
  public restoreItem(deletedItemId: string): boolean {
    const itemIndex = this.state.recycleBin.findIndex((i) => i.id === deletedItemId);
    if (itemIndex === -1) return false;

    const item = this.state.recycleBin[itemIndex];
    const restoredNode = item.node;

    let parentNode: VFSNode | null = restoredNode.parentId
      ? this.state.nodes[restoredNode.parentId]
      : null;

    if (!parentNode) {
      const myDocs = this.getNodeByPath('C:\\My Documents');
      parentNode = myDocs || this.state.nodes[this.state.rootId];
      restoredNode.parentId = parentNode.id;
      restoredNode.path = parentNode.path === 'C:' ? `C:\\${restoredNode.name}` : `${parentNode.path}\\${restoredNode.name}`;
    }

    this.state.nodes[restoredNode.id] = restoredNode;
    this.state.recycleBin.splice(itemIndex, 1);
    this.notify();
    return true;
  }

  // Empty Recycle Bin
  public emptyRecycleBin(): void {
    this.state.recycleBin = [];
    this.notify();
  }

  // Copy node
  public copyNode(nodeId: string, targetParentIdOrPath: string): VFSNode | null {
    const sourceNode = this.state.nodes[nodeId];
    if (!sourceNode) return null;

    const targetParent = this.state.nodes[targetParentIdOrPath] || this.getNodeByPath(targetParentIdOrPath);
    if (!targetParent || targetParent.type !== 'folder') return null;

    let newName = sourceNode.name;
    const existing = this.getChildren(targetParent.id).find(
      (c) => c.name.toUpperCase() === newName.toUpperCase()
    );
    if (existing) {
      if (sourceNode.type === 'file') {
        const parts = sourceNode.name.split('.');
        const ext = parts.length > 1 ? '.' + parts.pop() : '';
        newName = `${parts.join('.')} (Copy)${ext}`;
      } else {
        newName = `${sourceNode.name} (Copy)`;
      }
    }

    if (sourceNode.type === 'file') {
      return this.createFile(targetParent.id, newName, sourceNode.content, sourceNode.extension);
    } else {
      const newFolder = this.createFolder(targetParent.id, newName);
      if (newFolder) {
        const sourceChildren = this.getChildren(sourceNode.id);
        sourceChildren.forEach((child) => {
          this.copyNode(child.id, newFolder.id);
        });
      }
      return newFolder;
    }
  }

  // Move node
  public moveNode(nodeId: string, targetParentIdOrPath: string): boolean {
    const node = this.state.nodes[nodeId];
    if (!node || node.id === this.state.rootId || node.isSystem) return false;

    const targetParent = this.state.nodes[targetParentIdOrPath] || this.getNodeByPath(targetParentIdOrPath);
    if (!targetParent || targetParent.type !== 'folder' || targetParent.id === node.parentId) return false;

    if (node.type === 'folder' && targetParent.path.startsWith(node.path)) {
      return false;
    }

    const oldPath = node.path;
    node.parentId = targetParent.id;
    node.path = targetParent.path === 'C:' ? `C:\\${node.name}` : `${targetParent.path}\\${node.name}`;
    node.modifiedAt = Date.now();

    if (node.type === 'folder') {
      this.updateChildPaths(node.id, oldPath, node.path);
    }

    this.notify();
    return true;
  }

  // Search files and folders
  public searchFiles(query: string, startPath: string = 'C:'): VFSNode[] {
    const q = query.trim().toUpperCase();
    if (!q) return [];
    const root = this.getNodeByPath(startPath);
    if (!root) return [];

    return Object.values(this.state.nodes).filter(
      (n) => n.path.startsWith(root.path) && n.name.toUpperCase().includes(q)
    );
  }

  // Reset to initial defaults
  public resetToDefault(): void {
    this.state = createInitialFileSystem();
    this.notify();
  }
}

export const vfsService = new VFSService();

