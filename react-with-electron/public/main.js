const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const path = require("path");
const axios = require("axios");

let mainWindow;
let screenshotInterval = null;

/**
 * Create the main application window.
 */
const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: false,
    },
  });

  // Load the React app
  mainWindow.loadURL("http://localhost:3000");

  // Uncomment to open DevTools programmatically in the main window
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    app.quit();
  });
};

/**
 * Initialize the Electron app when ready.
 */
app.whenReady().then(() => {
  createMainWindow();

  /**
   * Handle taking a screenshot.
   */
  ipcMain.handle("take-screenshot", async (event, userId) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ["screen"] });
      const suitableSource = sources.find(
        (source) => source.name === "Entire screen"
      );

      if (!suitableSource) return;

      const imageBuffer = suitableSource.thumbnail.toPNG();
      const base64Image = imageBuffer.toString("base64");

      await axios.post("http://localhost:3499/api/screenshots", {
        userId,
        image: base64Image,
      });
    } catch (error) {
      console.error("Failed to capture or send screenshot:", error.message);
    }
  });

  /**
   * Handle updating the configuration for screenshot capturing.
   */
  ipcMain.on("update-config", (event, config) => {
    console.log("Received config:", config);

    clearInterval(screenshotInterval);
    if (config.interval >= 1000) {
      screenshotInterval = setInterval(async () => {
        try {
          const sources = await desktopCapturer.getSources({
            types: ["screen"],
          });
          const suitableSource = sources.find(
            (source) => source.name === "Entire screen"
          );

          if (!suitableSource) return;

          const imageBuffer = suitableSource.thumbnail.toPNG();
          const base64Image = imageBuffer.toString("base64");

          await axios.post("http://localhost:3499/api/screenshots", {
            userId: config.userId,
            image: base64Image,
          });
        } catch (error) {
          console.error("Failed to capture or send screenshot:", error.message);
        }
      }, config.interval);
    }
  });

  /**
   * Handle stopping the screenshot capturing.
   */
  ipcMain.on("stop-capturing", () => {
    console.log("Stopping capturing...");
    clearInterval(screenshotInterval);
    screenshotInterval = null;
  });
});

/**
 * Quit the app when all windows are closed.
 */
app.on("window-all-closed", () => {
  if (mainWindow) mainWindow.close();
  app.quit();
});
