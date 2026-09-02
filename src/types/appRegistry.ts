export interface AppDefinition {
  id: string;
  name: string;
  icon: string;
  category?: 'accessories' | 'system' | 'games' | 'main';
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  canResize?: boolean;
  canMaximize?: boolean;
  canMinimize?: boolean;
  isDialog?: boolean;
  commandName?: string; // For Run dialog and CMD
  description?: string;
}

