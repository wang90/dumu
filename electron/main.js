const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

let db;

function initDatabase() {
  const dbPath = path.join(app.getPath("userData"), "dumu.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

function registerIpcHandlers() {
  ipcMain.handle("accounts:list", async () => {
    return db
      .prepare(
        "SELECT id, title, username, password, notes, created_at, updated_at FROM accounts ORDER BY updated_at DESC, id DESC"
      )
      .all();
  });

  ipcMain.handle("accounts:create", async (_, payload) => {
    const { title, username, password, notes = "" } = payload;
    const info = db
      .prepare(
        "INSERT INTO accounts (title, username, password, notes, updated_at) VALUES (?, ?, ?, ?, datetime('now'))"
      )
      .run(title, username, password, notes);
    return db
      .prepare(
        "SELECT id, title, username, password, notes, created_at, updated_at FROM accounts WHERE id = ?"
      )
      .get(info.lastInsertRowid);
  });

  ipcMain.handle("accounts:update", async (_, payload) => {
    const { id, title, username, password, notes = "" } = payload;
    db.prepare(
      "UPDATE accounts SET title = ?, username = ?, password = ?, notes = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(title, username, password, notes, id);
    return db
      .prepare(
        "SELECT id, title, username, password, notes, created_at, updated_at FROM accounts WHERE id = ?"
      )
      .get(id);
  });

  ipcMain.handle("accounts:delete", async (_, id) => {
    db.prepare("DELETE FROM accounts WHERE id = ?").run(id);
    return true;
  });

  ipcMain.handle("accounts:export", async () => {
    const rows = db
      .prepare(
        "SELECT id, title, username, password, notes, created_at, updated_at FROM accounts ORDER BY id ASC"
      )
      .all();
    const result = await dialog.showSaveDialog({
      title: "导出数据",
      defaultPath: path.join(
        app.getPath("documents"),
        `dumu-export-${Date.now()}.json`
      ),
      filters: [{ name: "JSON", extensions: ["json"] }],
    });
    if (result.canceled || !result.filePath) return { canceled: true };
    fs.writeFileSync(
      result.filePath,
      JSON.stringify(
        {
          name: "Dumu Local Account Manager",
          exportedAt: new Date().toISOString(),
          data: rows,
        },
        null,
        2
      ),
      "utf8"
    );
    return { canceled: false, filePath: result.filePath };
  });

  ipcMain.handle("accounts:import", async () => {
    const result = await dialog.showOpenDialog({
      title: "导入数据",
      filters: [{ name: "JSON", extensions: ["json"] }],
      properties: ["openFile"],
    });
    if (result.canceled || result.filePaths.length === 0) {
      return { canceled: true };
    }
    const raw = fs.readFileSync(result.filePaths[0], "utf8");
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed?.data) ? parsed.data : [];
    const insert = db.prepare(
      "INSERT INTO accounts (title, username, password, notes, updated_at) VALUES (?, ?, ?, ?, datetime('now'))"
    );
    const tx = db.transaction((items) => {
      db.prepare("DELETE FROM accounts").run();
      for (const item of items) {
        insert.run(
          item.title || "",
          item.username || item.value || "",
          item.password || "",
          item.notes || item.descript || ""
        );
      }
    });
    tx(rows);
    return { canceled: false, count: rows.length };
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 900,
    minHeight: 620,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    win.loadURL(devServerUrl);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app
  .whenReady()
  .then(() => {
    initDatabase();
    registerIpcHandlers();
    createWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  })
  .catch((error) => {
    console.error("[dumu] startup failed:", error);
    app.exit(1);
  });

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  if (db) db.close();
});
