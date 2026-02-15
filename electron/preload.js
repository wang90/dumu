const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dumuApi", {
  listAccounts: () => ipcRenderer.invoke("accounts:list"),
  createAccount: (payload) => ipcRenderer.invoke("accounts:create", payload),
  updateAccount: (payload) => ipcRenderer.invoke("accounts:update", payload),
  deleteAccount: (id) => ipcRenderer.invoke("accounts:delete", id),
  exportAccounts: () => ipcRenderer.invoke("accounts:export"),
  importAccounts: () => ipcRenderer.invoke("accounts:import"),
});
