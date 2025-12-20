/**
 * IPC Handlers - Communication between main and renderer processes
 */

import { IpcMain, BrowserWindow, app, dialog } from 'electron';
import log from 'electron-log';

export function setupIpcHandlers(
  ipcMain: IpcMain,
  mainWindow: BrowserWindow | null
): void {
  // App info
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  ipcMain.handle('get-app-path', (_, name: string) => {
    return app.getPath(name as Parameters<typeof app.getPath>[0]);
  });

  // Window controls
  ipcMain.on('window-minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.on('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });

  ipcMain.on('window-close', () => {
    mainWindow?.close();
  });

  // File dialogs
  ipcMain.handle('show-open-dialog', async (_, options) => {
    if (!mainWindow) return { canceled: true, filePaths: [] };
    return dialog.showOpenDialog(mainWindow, options);
  });

  ipcMain.handle('show-save-dialog', async (_, options) => {
    if (!mainWindow) return { canceled: true, filePath: undefined };
    return dialog.showSaveDialog(mainWindow, options);
  });

  // Logging
  ipcMain.on('log', (_, level: string, message: string) => {
    switch (level) {
      case 'error':
        log.error('[Renderer]', message);
        break;
      case 'warn':
        log.warn('[Renderer]', message);
        break;
      case 'info':
        log.info('[Renderer]', message);
        break;
      default:
        log.debug('[Renderer]', message);
    }
  });
}
