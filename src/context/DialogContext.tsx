import React, { createContext, useContext, useState, useCallback } from 'react';
import { soundService } from '../services/soundService';

export interface MessageBoxOptions {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info' | 'question';
  buttons?: 'ok' | 'ok-cancel' | 'yes-no';
  onOk?: () => void;
  onCancel?: () => void;
  onYes?: () => void;
  onNo?: () => void;
}

export interface PropertiesDialogOptions {
  id: string;
  title: string;
  targetType: 'file' | 'folder' | 'system' | 'desktop';
  targetId?: string;
  customData?: any;
}

interface DialogContextType {
  messageBoxes: MessageBoxOptions[];
  propertiesDialogs: PropertiesDialogOptions[];
  isRunDialogOpen: boolean;
  isShutDownDialogOpen: boolean;
  isFindDialogOpen: boolean;
  showMessageBox: (options: Omit<MessageBoxOptions, 'id'>) => string;
  showError: (message: string, title?: string, onOk?: () => void) => string;
  showWarning: (message: string, title?: string, onOk?: () => void) => string;
  showInfo: (message: string, title?: string, onOk?: () => void) => string;
  showConfirm: (message: string, onYes?: () => void, onNo?: () => void, title?: string) => string;
  closeMessageBox: (id: string) => void;
  openRunDialog: () => void;
  closeRunDialog: () => void;
  openShutDownDialog: () => void;
  closeShutDownDialog: () => void;
  openFindDialog: () => void;
  closeFindDialog: () => void;
  openPropertiesDialog: (options: Omit<PropertiesDialogOptions, 'id'>) => string;
  closePropertiesDialog: (id: string) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messageBoxes, setMessageBoxes] = useState<MessageBoxOptions[]>([]);
  const [propertiesDialogs, setPropertiesDialogs] = useState<PropertiesDialogOptions[]>([]);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isShutDownDialogOpen, setIsShutDownDialogOpen] = useState(false);
  const [isFindDialogOpen, setIsFindDialogOpen] = useState(false);

  const showMessageBox = useCallback((options: Omit<MessageBoxOptions, 'id'>): string => {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    if (options.type === 'error') soundService.playCriticalStop();
    else if (options.type === 'warning') soundService.playExclamation();
    else if (options.type === 'info') soundService.playAsterisk();
    else if (options.type === 'question') soundService.playQuestion();

    setMessageBoxes((prev) => [...prev, { ...options, id }]);
    return id;
  }, []);

  const showError = useCallback(
    (message: string, title: string = 'Error', onOk?: () => void) => {
      return showMessageBox({
        title,
        message,
        type: 'error',
        buttons: 'ok',
        onOk,
      });
    },
    [showMessageBox]
  );

  const showWarning = useCallback(
    (message: string, title: string = 'Warning', onOk?: () => void) => {
      return showMessageBox({
        title,
        message,
        type: 'warning',
        buttons: 'ok',
        onOk,
      });
    },
    [showMessageBox]
  );

  const showInfo = useCallback(
    (message: string, title: string = 'Information', onOk?: () => void) => {
      return showMessageBox({
        title,
        message,
        type: 'info',
        buttons: 'ok',
        onOk,
      });
    },
    [showMessageBox]
  );

  const showConfirm = useCallback(
    (message: string, onYes?: () => void, onNo?: () => void, title: string = 'Confirm') => {
      return showMessageBox({
        title,
        message,
        type: 'question',
        buttons: 'yes-no',
        onYes,
        onNo,
      });
    },
    [showMessageBox]
  );

  const closeMessageBox = useCallback((id: string) => {
    setMessageBoxes((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const openRunDialog = useCallback(() => setIsRunDialogOpen(true), []);
  const closeRunDialog = useCallback(() => setIsRunDialogOpen(false), []);

  const openShutDownDialog = useCallback(() => setIsShutDownDialogOpen(true), []);
  const closeShutDownDialog = useCallback(() => setIsShutDownDialogOpen(false), []);

  const openFindDialog = useCallback(() => setIsFindDialogOpen(true), []);
  const closeFindDialog = useCallback(() => setIsFindDialogOpen(false), []);

  const openPropertiesDialog = useCallback((options: Omit<PropertiesDialogOptions, 'id'>): string => {
    const id = `props_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setPropertiesDialogs((prev) => [...prev, { ...options, id }]);
    return id;
  }, []);

  const closePropertiesDialog = useCallback((id: string) => {
    setPropertiesDialogs((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <DialogContext.Provider
      value={{
        messageBoxes,
        propertiesDialogs,
        isRunDialogOpen,
        isShutDownDialogOpen,
        isFindDialogOpen,
        showMessageBox,
        showError,
        showWarning,
        showInfo,
        showConfirm,
        closeMessageBox,
        openRunDialog,
        closeRunDialog,
        openShutDownDialog,
        closeShutDownDialog,
        openFindDialog,
        closeFindDialog,
        openPropertiesDialog,
        closePropertiesDialog,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
};

