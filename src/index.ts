import debug from "debug";
import Electron from "electron";
import http from "http";

import App from "./App";

export default class Main {

  public static main(app: Electron.App, browserWindow: typeof Electron.BrowserWindow) {
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);
    Main.application.on("activate", Main.onActivate);
    Main.bootServer();
  }

  private static application: Electron.App;
  private static BrowserWindow: typeof Electron.BrowserWindow;
  private static mainWindow: Electron.BrowserWindow;
  private static port: string | number | boolean;
  private static server: http.Server;

  private static onReady() {
    Main.mainWindow = new Main.BrowserWindow({width: 800, height: 600});
    Main.mainWindow.loadURL("http://localhost:" + Main.port);
    // Main.mainWindow.loadURL('file://' + __dirname + '/index.html');
    Main.mainWindow.webContents.openDevTools();
    Main.mainWindow.on("closed", Main.onClose);
  }

  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
       Main.application.quit();
    }
  }

  private static onActivate() {
    if (Main.mainWindow === null) {
         Main.onReady();
    }
  }

  private static onClose() {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  private static bootServer() {
    debug("ts-express:server");

    Main.port = Main.normalizePort(process.env.PORT || 3000);
    App.set("port", Main.port);

    Main.server = http.createServer(App);
    Main.server.listen(Main.port);
    Main.server.on("error", Main.onError);
    Main.server.on("listening", Main.onListening);
  }

  private static normalizePort(val: number|string): number|string|boolean {
    const port: number = (typeof val === "string") ? parseInt(val, 10) : val;
    if (isNaN(port)) {
      return val;
    } else if (port >= 0) {
      return port;
    } else {
      return false;
    }
  }

  private static onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = (typeof Main.port === "string") ? "Pipe " + Main.port : "Port " + Main.port;
    switch (error.code) {
      case "EACCES":
        // tslint:disable-next-line:no-console
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        // tslint:disable-next-line:no-console
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
      }
  }

  private static onListening(): void {
    const addr = Main.server.address();
    const bind = (typeof addr === "string") ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
  }
}

Main.main(Electron.app, Electron.BrowserWindow);
