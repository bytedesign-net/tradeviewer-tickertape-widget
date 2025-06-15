const { app, BrowserWindow } = require("electron");
const path = require("node:path");

// インストール/アンインストール時にWindowsのショートカットを作成/削除する処理
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // ブラウザウィンドウを作成
  const { screen } = require("electron");

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const mainWindow = new BrowserWindow({
    x: width - 800,
    y: 0,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      transparent: true,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.setMenu(null);

  mainWindow.webContents.on("did-finish-load", () => {
    const size = mainWindow.webContents.executeJavaScript(
      "electronAPI.getSize()"
    );
    size.then((result) => {
      mainWindow.setContentSize(result.width, result.height);
    });

    const theme = mainWindow.webContents.executeJavaScript(
      "electronAPI.getSystemTheme()"
    );
    theme.then((result) => {
      mainWindow.setBackgroundColor(result === "dark" ? "#1e1e1e" : "#ffffff");
    });
  });

  mainWindow.setAlwaysOnTop(true);

  mainWindow.on("focus", () => {
    mainWindow.setOpacity(1);
  });

  mainWindow.on("blur", () => {
    mainWindow.setOpacity(0.7);
  });

  setInterval(() => {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }, 180000);
};

// Electronの初期化が完了し、ブラウザウィンドウを作成する準備ができたときに、このメソッドが呼び出されます。
// このイベントが発生した後でのみ、一部のAPIを使用できます。
app.whenReady().then(() => {
  createWindow();

  // OS Xでは、ドックアイコンがクリックされ、他にウィンドウが開いていない場合に、アプリでウィンドウを再作成するのが一般的です。
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// macOSを除き、すべてのウィンドウが閉じられたときに終了します。そこでは、アプリケーションとそのメニューバーは、ユーザーがCmd + Qで明示的に終了するまでアクティブなままにしておくのが一般的です。
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// このファイルには、アプリの特定のメインプロセスコードの残りの部分を含めることができます。また、それらを個別のファイルに入れて、ここでインポートすることもできます。
