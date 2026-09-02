export interface WindowBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  icon?: string;
  bounds: WindowBounds;
  prevBounds?: WindowBounds; // For restore from maximize
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  zIndex: number;
  isDialog?: boolean;
  canResize?: boolean;
  canMinimize?: boolean;
  canMaximize?: boolean;
  minWidth?: number;
  minHeight?: number;
  customData?: any; // Additional props passed to the application (e.g. initialFilePath)
}

export type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

