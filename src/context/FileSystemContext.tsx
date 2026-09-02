import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { FileSystemState, VFSNode } from '../types/filesystem';
import { vfsService } from '../services/vfsService';

interface FileSystemContextType {
  fsState: FileSystemState;
  createFile: (parentPathOrId: string, name: string, content?: string, extension?: string) => VFSNode | null;
  createFolder: (parentPathOrId: string, name: string) => VFSNode | null;
  readFile: (pathOrId: string) => string | null;
  writeFile: (pathOrId: string, content: string) => boolean;
  deleteNode: (nodeId: string, permanent?: boolean) => boolean;
  restoreItem: (deletedItemId: string) => boolean;
  emptyRecycleBin: () => void;
  renameNode: (nodeId: string, newName: string) => boolean;
  copyNode: (nodeId: string, targetPathOrId: string) => VFSNode | null;
  moveNode: (nodeId: string, targetPathOrId: string) => boolean;
  getNodeById: (id: string) => VFSNode | null;
  getNodeByPath: (path: string) => VFSNode | null;
  getChildren: (parentId: string) => VFSNode[];
  searchFiles: (query: string, startPath?: string) => VFSNode[];
  resetFileSystem: () => void;
  recycleBinCount: number;
}

const FileSystemContext = createContext<FileSystemContextType | null>(null);

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fsState, setFsState] = useState<FileSystemState>(() => vfsService.getState());

  useEffect(() => {
    const unsubscribe = vfsService.subscribe(() => {
      setFsState({ ...vfsService.getState() });
    });
    return () => unsubscribe();
  }, []);

  const createFile = useCallback((parentPathOrId: string, name: string, content?: string, extension?: string) => {
    return vfsService.createFile(parentPathOrId, name, content, extension);
  }, []);

  const createFolder = useCallback((parentPathOrId: string, name: string) => {
    return vfsService.createFolder(parentPathOrId, name);
  }, []);

  const readFile = useCallback((pathOrId: string) => {
    return vfsService.readFile(pathOrId);
  }, []);

  const writeFile = useCallback((pathOrId: string, content: string) => {
    return vfsService.writeFile(pathOrId, content);
  }, []);

  const deleteNode = useCallback((nodeId: string, permanent: boolean = false) => {
    return vfsService.deleteNode(nodeId, permanent);
  }, []);

  const restoreItem = useCallback((deletedItemId: string) => {
    return vfsService.restoreItem(deletedItemId);
  }, []);

  const emptyRecycleBin = useCallback(() => {
    vfsService.emptyRecycleBin();
  }, []);

  const renameNode = useCallback((nodeId: string, newName: string) => {
    return vfsService.renameNode(nodeId, newName);
  }, []);

  const copyNode = useCallback((nodeId: string, targetPathOrId: string) => {
    return vfsService.copyNode(nodeId, targetPathOrId);
  }, []);

  const moveNode = useCallback((nodeId: string, targetPathOrId: string) => {
    return vfsService.moveNode(nodeId, targetPathOrId);
  }, []);

  const getNodeById = useCallback((id: string) => {
    return vfsService.getNodeById(id);
  }, []);

  const getNodeByPath = useCallback((path: string) => {
    return vfsService.getNodeByPath(path);
  }, []);

  const getChildren = useCallback((parentId: string) => {
    return vfsService.getChildren(parentId);
  }, []);

  const searchFiles = useCallback((query: string, startPath: string = 'C:') => {
    return vfsService.searchFiles(query, startPath);
  }, []);

  const resetFileSystem = useCallback(() => {
    vfsService.resetToDefault();
  }, []);

  return (
    <FileSystemContext.Provider
      value={{
        fsState,
        createFile,
        createFolder,
        readFile,
        writeFile,
        deleteNode,
        restoreItem,
        emptyRecycleBin,
        renameNode,
        copyNode,
        moveNode,
        getNodeById,
        getNodeByPath,
        getChildren,
        searchFiles,
        resetFileSystem,
        recycleBinCount: fsState.recycleBin?.length || 0,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) throw new Error('useFileSystem must be used within a FileSystemProvider');
  return context;
};

