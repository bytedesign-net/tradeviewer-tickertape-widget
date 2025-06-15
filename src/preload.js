const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getSize: () => {
    const container = document.querySelector(".tradingview-widget-container");
    return {
      width: container.offsetWidth,
      height: container.offsetHeight,
    };
  },
  getSystemTheme: () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  },
});
