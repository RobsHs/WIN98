export type FileType = 'file' | 'folder';

export interface VFSNode {
  id: string;
  name: string;
  path: string; // e.g., 'C:\\WINDOWS\\SYSTEM'
  type: FileType;
  parentId: string | null;
  createdAt: number;
  modifiedAt: number;
  size: number; // in bytes
  content?: string; // for text or base64 data
  extension?: string; // e.g. 'txt', 'bmp', 'ini', 'sys', 'htm', 'exe'
  icon?: string; // custom icon identifier
  isSystem?: boolean; // system protected
  isReadOnly?: boolean;
  isHidden?: boolean;
}

export interface DeletedItem {
  id: string;
  node: VFSNode;
  originalPath: string;
  deletedAt: number;
}

export interface FileSystemState {
  nodes: Record<string, VFSNode>; // keyed by node.id
  rootId: string;
  recycleBin: DeletedItem[];
}

export interface ClipboardItem {
  nodeId: string;
  action: 'copy' | 'cut';
}

