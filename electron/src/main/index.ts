/**
 * FABRIC Desktop - Main Electron Entry Point
 *
 * This is the main process entry point for the FABRIC desktop application.
 * It handles window creation, backend integration, and auto-updates.
 */

import { app, BrowserWindow, ipcMain, dialog, shell } from 'electron';
import path from 'path';
import log from 'electron-log';
import { BackendBridge } from './backend-bridge';
import { setupAutoUpdater } from './auto-updater';
import { setupIpcHandlers } from './ipc-handlers';

// Configure logging
log.transports.file.level = 'info';
log.transports.console.level = 'debug';

const isDev = process.env.NODE_ENV === 'development';
const backendBridge = new BackendBridge();
let mainWindow: BrowserWindow | null = null;

/**
 * Create the main application window
 */
async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#0d1117',
    show: false,
  });

  // Show window when ready to avoid flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    // Development: load from Vite dev server
    log.info('Loading from Vite dev server...');
    await mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Production: load from bundled files
    const rendererPath = path.join(process.resourcesPath, 'renderer', 'index.html');
    log.info('Loading from bundled renderer:', rendererPath);
    await mainWindow.loadFile(rendererPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Initialize the application
 */
async function initialize(): Promise<void> {
  log.info('Starting FABRIC Desktop');
  log.info('Version:', app.getVersion());
  log.info('Platform:', process.platform);
  log.info('Development mode:', isDev);

  // Start embedded backend
  try {
    log.info('Starting embedded backend...');
    await backendBridge.start();
    log.info('Backend started successfully');
  } catch (error) {
    log.error('Failed to start backend:', error);
    dialog.showErrorBox(
      'Backend Error',
      'Failed to start the FABRIC backend. Please restart the application.'
    );
    app.quit();
    return;
  }

  // Set up IPC handlers
  setupIpcHandlers(ipcMain, mainWindow);

  // Create main window
  await createWindow();

  // Set up auto-updater (production only)
  if (!isDev && mainWindow) {
    setupAutoUpdater(mainWindow);
  }
}

// App lifecycle events
app.whenReady().then(initialize);

app.on('window-all-closed', async () => {
  log.info('All windows closed');
  await backendBridge.stop();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    await createWindow();
  }
});

app.on('before-quit', async () => {
  log.info('App quitting...');
  await backendBridge.stop();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  log.error('Unhandled rejection:', error);
});
