const { app, BrowserWindow, ipcMain, desktopCapturer } = require("electron");
const path = require("path");
const axios = require("axios");

let mainWindow;
let screenshotInterval = null;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: true,
      nodeIntegration: false,
    },
  });

  // Load the React app
  mainWindow.loadURL("http://localhost:3000");
  // To open DevTools programmatically in the main window
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    app.quit();
  });
};

app.whenReady().then(() => {
  createMainWindow();

  ipcMain.handle("take-screenshot", async (event, userId) => {
    try {
      const sources = await desktopCapturer.getSources({ types: ["screen"] });
      let suitableSource = sources.find(
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

  ipcMain.on("update-config", (event, config) => {
    console.log("Received config:", config);

    clearInterval(screenshotInterval);
    if (config.interval >= 1000) {
      screenshotInterval = setInterval(async () => {
        try {
          const sources = await desktopCapturer.getSources({
            types: ["screen"],
          });
          let suitableSource = sources.find(
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

  ipcMain.on("stop-capturing", () => {
    console.log("Stopping capturing...");
    clearInterval(screenshotInterval);
    screenshotInterval = null;
  });
});

app.on("window-all-closed", () => {
  if (mainWindow) mainWindow.close();
  app.quit();
});
