const { app, BrowserWindow, desktopCapturer, session } = require("electron");
const path = require("node:path");

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 620,
    backgroundColor: "#000000",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize();
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  session.defaultSession.setDisplayMediaRequestHandler(async (_request, callback) => {
    try {
      const sources = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width: 0, height: 0 },
      });

      if (!sources.length) {
        callback({});
        return;
      }

      callback({
        video: sources[0],
        audio: "loopback",
      });
    } catch (error) {
      console.error("System audio capture failed:", error);
      callback({});
    }
  });

  session.defaultSession.setPermissionCheckHandler(
    (_webContents, permission) => permission === "media",
  );

  session.defaultSession.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      callback(permission === "media");
    },
  );

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
