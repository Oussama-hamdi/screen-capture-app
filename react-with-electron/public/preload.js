const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  updateConfig: (config) => ipcRenderer.send("update-config", config),
  stopCapturing: () => ipcRenderer.send("stop-capturing"),
});
