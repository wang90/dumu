# Dumu

一个运行在 macOS 的本地桌面应用，用于离线管理账号和密码。

## 当前架构

- 桌面壳：Electron
- 前端：React + Vite
- 本地数据库：SQLite（`better-sqlite3`）
- 数据位置：`~/Library/Application Support/<app-name>/dumu.db`

## 功能

- 账号记录的新增、编辑、删除
- 本地搜索（标题/账号/备注）
- 一键复制账号和密码
- JSON 导入/导出
- 全离线运行，不依赖远程服务

## 本地开发

```bash
npm install
npm run dev
```

> 在部分网络环境下安装 `electron` 可能超时，可使用：
>
> ```bash
> ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/" npm install
> ```

## 构建前端资源

```bash
npm run build
```

## 项目目录（核心）

- `electron/main.js`：桌面主进程 + SQLite 初始化 + IPC 接口
- `electron/preload.js`：渲染进程可调用的安全 API
- `src/App.jsx`：React 页面（账号管理 UI）
