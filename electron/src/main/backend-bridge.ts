/**
 * Backend Bridge - Embeds Express server within Electron
 *
 * This module handles starting and stopping the Express backend
 * within the Electron main process.
 */

import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import log from 'electron-log';

export class BackendBridge {
  private isRunning = false;
  private shutdownHandler: (() => Promise<void>) | null = null;

  /**
   * Start the embedded backend server
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      log.warn('Backend already running');
      return;
    }

    // Configure environment for embedded mode
    const userDataPath = app.getPath('userData');
    const dataPath = path.join(userDataPath, 'data');

    // Ensure data directory exists
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath, { recursive: true });
      log.info('Created data directory:', dataPath);
    }

    // Set environment variables for the backend
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    process.env.PORT = '3001';
    process.env.ENABLE_SQLITE_MEMORY = 'true';
    process.env.SERVE_FRONTEND = 'false'; // Electron serves the frontend

    // Override database paths to use userData directory
    process.env.DB_DATA_DIR = dataPath;

    // Determine backend location
    const backendPath = app.isPackaged
      ? path.join(process.resourcesPath, 'backend')
      : path.join(__dirname, '../../../backend/dist');

    log.info('Backend path:', backendPath);
    log.info('Data path:', dataPath);

    try {
      // Dynamically import and start the backend
      const serverModule = await import(
        path.join(backendPath, 'server.js')
      );

      // Store shutdown handler for graceful cleanup
      if (typeof serverModule.gracefulShutdown === 'function') {
        this.shutdownHandler = serverModule.gracefulShutdown;
      }

      // Start the server if it exports a start function
      if (typeof serverModule.startServer === 'function') {
        await serverModule.startServer();
      }

      this.isRunning = true;
      log.info('Backend started on port', process.env.PORT);
    } catch (error) {
      log.error('Failed to start backend:', error);
      throw error;
    }
  }

  /**
   * Stop the embedded backend server
   */
  async stop(): Promise<void> {
    if (!this.isRunning) {
      log.warn('Backend not running');
      return;
    }

    log.info('Stopping backend...');

    if (this.shutdownHandler) {
      try {
        await this.shutdownHandler();
        log.info('Backend stopped gracefully');
      } catch (error) {
        log.error('Error during backend shutdown:', error);
      }
    }

    this.isRunning = false;
  }

  /**
   * Check if the backend is running
   */
  get running(): boolean {
    return this.isRunning;
  }
}
