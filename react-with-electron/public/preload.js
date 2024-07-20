const { contextBridge, ipcRenderer } = require("electron");

/**
 * Expose Electron APIs to the renderer process through the `window.electronAPI` object.
 */
contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Send an IPC message to update the screenshot capturing configuration.
   * @param {Object} config - The configuration object containing userId and interval.
   */
  updateConfig: (config) => ipcRenderer.send("update-config", config),

  /**
   * Send an IPC message to stop the screenshot capturing process.
   */
  stopCapturing: () => ipcRenderer.send("stop-capturing"),
});
