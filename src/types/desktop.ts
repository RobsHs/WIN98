export interface DesktopIconItem {
  id: string;
  title: string;
  icon: string;
  appId?: string;
  filePath?: string; // Path in VFS if this represents a file/folder
  gridX: number; // Grid column (0-indexed)
  gridY: number; // Grid row (0-indexed)
  isSystem?: boolean;
}

export interface SelectionRect {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

