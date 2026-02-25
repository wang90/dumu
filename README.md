# Dumu

[中文文档](README.zh-CN.md)

A local desktop app for macOS to manage accounts and passwords fully offline.

## Documentation (Web Website)

- English docs: `docs/README.md`
- Chinese docs: `docs/README.zh-CN.md`

## Tech Stack

- Desktop shell: Electron
- Frontend: React + Vite
- Local database: SQLite (`better-sqlite3`)
- Data location: `~/Library/Application Support/<app-name>/dumu.db`

## Features

- Create, edit, and delete credential entries
- Local search (title / username / notes)
- One-click copy for username and password
- Import password CSV exported from Chrome
- JSON import/export
- Quick save to dumu from a Chrome extension (`127.0.0.1:32123`)
- Fully offline, no remote service required

## Local Development

```bash
npm install
npm run dev
```

> If installing `electron` times out in some networks, try:
>
> ```bash
> ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" npm install
> ```

## Build Frontend Assets

```bash
npm run build
```

## Core Project Structure

- `electron/main.js`: Electron main process + SQLite init + IPC APIs
- `electron/preload.js`: Secure APIs exposed to renderer
- `src/App.jsx`: React UI for credential management

## Chrome Quick Save (Optional)

1. Start dumu (`npm run dev` or the desktop app).
2. Open `chrome://extensions/` in Chrome and enable Developer Mode.
3. Click **Load unpacked** and select the `chrome-extension` folder in this project.
4. On any login page, click the extension icon. You can click **Wake dumu**, then **Read Current Page**, and finally **Save to dumu**.
5. If the local API is unreachable, the extension will try to wake the app via the `dumu://focus` protocol.

> Note: the extension writes to dumu through the local API `http://127.0.0.1:32123/quick-save` and does not use any remote network.
