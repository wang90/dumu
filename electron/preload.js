const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dumuApi", {
  listAccounts: () => ipcRenderer.invoke("accounts:list"),
  createAccount: (payload) => ipcRenderer.invoke("accounts:create", payload),
  updateAccount: (payload) => ipcRenderer.invoke("accounts:update", payload),
  deleteAccount: (id) => ipcRenderer.invoke("accounts:delete", id),
  exportAccounts: () => ipcRenderer.invoke("accounts:export"),
  importAccounts: () => ipcRenderer.invoke("accounts:import"),
  importChromeCsv: () => ipcRenderer.invoke("accounts:import-chrome-csv"),
  onAccountsRefresh: (callback) => {
    const handler = () => callback();
    ipcRenderer.on("accounts:refresh", handler);
    return () => ipcRenderer.removeListener("accounts:refresh", handler);
  },
});
