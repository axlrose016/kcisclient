interface FileSystemPermissionMode {
  mode?: 'read' | 'readwrite';
}

interface FileSystemHandle {
  queryPermission(descriptor: FileSystemPermissionMode): Promise<PermissionState>;
  requestPermission(descriptor: FileSystemPermissionMode): Promise<PermissionState>;
  kind: 'file' | 'directory';
}

interface FileSystemFileHandle extends FileSystemHandle {
  getFile(): Promise<File>;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  values(): AsyncIterableIterator<FileSystemHandle>;
}

interface Window {
  showOpenFilePicker(options?: {
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }): Promise<FileSystemFileHandle[]>;
  
  showDirectoryPicker(): Promise<FileSystemDirectoryHandle>;
} 