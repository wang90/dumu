const { app, BrowserWindow, dialog, ipcMain, Menu, Tray, nativeImage } = require("electron");
const fs = require("fs");
const http = require("http");
const path = require("path");
const Database = require("better-sqlite3");

let db;
let mainWindow = null;
let tray = null;
let quickSaveServer = null;
const QUICK_SAVE_HOST = "127.0.0.1";
const QUICK_SAVE_PORT = 32123;
let pendingDeepLink = null;

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function parseCsv(content) {
  const text = String(content || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((ch === "\n" || ch === "\r") && !inQuotes) {
      row.push(cell);
      cell = "";
      if (row.some((value) => String(value).trim() !== "")) {
        rows.push(row);
      }
      row = [];
      if (ch === "\r" && next === "\n") i += 1;
      continue;
    }

    cell += ch;
  }

  row.push(cell);
  if (row.some((value) => String(value).trim() !== "")) {
    rows.push(row);
  }
  return rows;
}

function firstValueByIndex(row, indexes) {
  for (const idx of indexes) {
    const value = row[idx];
    if (value !== undefined) return String(value).trim();
  }
  return "";
}

function deriveTitle(name, url) {
  if (name) return name;
  if (!url) return "";
  try {
    return new URL(url).hostname || url;
  } catch {
    return url;
  }
}

function composeNotes(url, note) {
  const segments = [];
  if (url) segments.push(`来源网址: ${url}`);
  if (note) segments.push(note);
  return segments.join("\n");
}

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeQuickSavePayload(payload) {
  const title = normalizeText(payload?.title);
  const url = normalizeText(payload?.url);
  const username = normalizeText(payload?.username);
  const password = normalizeText(payload?.password);
  const note = normalizeText(payload?.notes);
  return {
    title: deriveTitle(title, url),
    username,
    password,
    notes: composeNotes(url, note),
  };
}

function createAccountRecord(payload) {
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
}

function startQuickSaveServer() {
  if (quickSaveServer) return;

  function writeJson(res, statusCode, data, origin) {
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Private-Network": "true",
    };
    if (origin) {
      headers.Vary = "Origin";
    }
    res.writeHead(statusCode, headers);
    res.end(JSON.stringify(data));
  }

  quickSaveServer = http.createServer((req, res) => {
    const origin = String(req.headers.origin || "");

    if (req.method === "OPTIONS") {
      writeJson(res, 200, { ok: true }, origin);
      return;
    }

    let pathname = "";
    try {
      pathname = new URL(req.url || "/", `http://${QUICK_SAVE_HOST}`).pathname;
    } catch {
      writeJson(res, 400, { ok: false, error: "无效请求地址" }, origin);
      return;
    }

    if (req.method !== "POST") {
      writeJson(res, 404, { ok: false, error: "接口不存在" }, origin);
      return;
    }

    if (pathname === "/focus") {
      focusMainWindow();
      writeJson(res, 200, { ok: true }, origin);
      return;
    }

    if (pathname !== "/quick-save") {
      writeJson(res, 404, { ok: false, error: "接口不存在" }, origin);
      return;
    }

    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 100 * 1024) {
        writeJson(res, 413, { ok: false, error: "请求体过大" }, origin);
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        const payload = JSON.parse(rawBody || "{}");
        const normalized = normalizeQuickSavePayload(payload);
        if (!normalized.title || !normalized.username || !normalized.password) {
          writeJson(
            res,
            400,
            { ok: false, error: "标题、账号、密码不能为空" },
            origin
          );
          return;
        }

        const row = createAccountRecord(normalized);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("accounts:refresh");
        }
        writeJson(res, 200, { ok: true, id: row.id }, origin);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        writeJson(res, 500, { ok: false, error: message }, origin);
      }
    });
  });

  quickSaveServer.listen(QUICK_SAVE_PORT, QUICK_SAVE_HOST, () => {
    console.log(`[dumu] quick-save server listening on http://${QUICK_SAVE_HOST}:${QUICK_SAVE_PORT}`);
  });
  quickSaveServer.on("error", (error) => {
    console.error("[dumu] quick-save server failed:", error);
  });
}

function registerProtocolClient() {
  const protocol = "dumu";
  if (process.defaultApp && process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(protocol, process.execPath, [
      path.resolve(process.argv[1]),
    ]);
    return;
  }
  app.setAsDefaultProtocolClient(protocol);
}

function handleDeepLink(url) {
  if (!url || !String(url).startsWith("dumu://")) return;
  focusMainWindow();
}

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

async function importChromeCsvFromDialog() {
  const result = await dialog.showOpenDialog({
    title: "导入 Chrome 密码 CSV",
    filters: [{ name: "CSV", extensions: ["csv"] }],
    properties: ["openFile"],
  });
  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true };
  }

  const raw = fs.readFileSync(result.filePaths[0], "utf8");
  const table = parseCsv(raw);
  if (table.length === 0) {
    return { canceled: false, count: 0, skipped: 0 };
  }

  const headers = table[0].map(normalizeHeader);
  const body = table.slice(1);

  const headerAliases = {
    title: ["name", "title", "网站名称", "名称", "titleorname"],
    url: ["url", "website", "site", "网站", "网址"],
    username: ["username", "usernameoremail", "用户名", "账号", "账户"],
    password: ["password", "密码"],
    note: ["note", "notes", "备注", "comment", "comments"],
  };

  function collectIndexes(type) {
    const aliases = headerAliases[type];
    const indexes = [];
    headers.forEach((header, idx) => {
      if (aliases.includes(header)) {
        indexes.push(idx);
      }
    });
    return indexes;
  }

  const titleIndexes = collectIndexes("title");
  const urlIndexes = collectIndexes("url");
  const usernameIndexes = collectIndexes("username");
  const passwordIndexes = collectIndexes("password");
  const noteIndexes = collectIndexes("note");

  const insert = db.prepare(
    "INSERT INTO accounts (title, username, password, notes, updated_at) VALUES (?, ?, ?, ?, datetime('now'))"
  );

  let importedCount = 0;
  let skippedCount = 0;
  const tx = db.transaction((items) => {
    for (const row of items) {
      const name = firstValueByIndex(row, titleIndexes);
      const url = firstValueByIndex(row, urlIndexes);
      const username = firstValueByIndex(row, usernameIndexes);
      const password = firstValueByIndex(row, passwordIndexes);
      const note = firstValueByIndex(row, noteIndexes);
      const title = deriveTitle(name, url);
      const notes = composeNotes(url, note);

      if (!title || !username || !password) {
        skippedCount += 1;
        continue;
      }

      insert.run(title, username, password, notes);
      importedCount += 1;
    }
  });

  tx(body);
  return { canceled: false, count: importedCount, skipped: skippedCount };
}

function focusMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    createWindow();
  }
  if (!mainWindow) return;
  if (mainWindow.isMinimized()) {
    mainWindow.restore();
  }
  mainWindow.show();
  mainWindow.focus();
}

function createTray() {
  if (tray) return;

  let trayIcon = nativeImage.createFromNamedImage("NSImageNameLockLockedTemplate", [
    0,
    0,
    0,
  ]);
  if (trayIcon.isEmpty()) {
    trayIcon = nativeImage.createEmpty();
  }
  tray = new Tray(trayIcon);
  tray.setToolTip("Dumu");
  if (process.platform === "darwin") {
    tray.setTitle("Dumu");
  }

  const rebuildTrayMenu = () => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "打开 Dumu",
        click: () => focusMainWindow(),
      },
      {
        label: "获取 Chrome 密码",
        click: async () => {
          try {
            const result = await importChromeCsvFromDialog();
            if (!result?.canceled) {
              const skipped = Number(result.skipped || 0);
              const skipText = skipped > 0 ? `，跳过 ${skipped} 条不完整记录` : "";
              await dialog.showMessageBox({
                type: "info",
                title: "Dumu",
                message: `Chrome CSV 导入完成，共 ${result.count} 条${skipText}`,
              });
              focusMainWindow();
              if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send("accounts:refresh");
              }
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            await dialog.showMessageBox({
              type: "error",
              title: "Dumu",
              message: `获取 Chrome 密码失败：${message}`,
            });
          }
        },
      },
      { type: "separator" },
      {
        label: "退出",
        role: "quit",
      },
    ]);
    tray.setContextMenu(contextMenu);
  };

  rebuildTrayMenu();
  tray.on("click", () => focusMainWindow());
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
    return createAccountRecord(payload);
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

  ipcMain.handle("accounts:import-chrome-csv", async () => {
    return importChromeCsvFromDialog();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
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
  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app
  .whenReady()
  .then(() => {
    registerProtocolClient();
    initDatabase();
    registerIpcHandlers();
    startQuickSaveServer();
    createTray();
    createWindow();
    if (pendingDeepLink) {
      handleDeepLink(pendingDeepLink);
      pendingDeepLink = null;
    }
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
  if (quickSaveServer) {
    quickSaveServer.close();
    quickSaveServer = null;
  }
  if (db) db.close();
});

app.on("open-url", (event, url) => {
  event.preventDefault();
  if (app.isReady()) {
    handleDeepLink(url);
    return;
  }
  pendingDeepLink = url;
});
