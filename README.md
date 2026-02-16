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
- 支持导入 Chrome 导出的密码 CSV
- JSON 导入/导出
- 支持 Chrome 扩展一键快速保存到 dumu（本地 `127.0.0.1:32123`）
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

## Chrome 快速保存（可选）

1. 启动 dumu（`npm run dev` 或桌面应用）。
2. 打开 Chrome 扩展页面：`chrome://extensions/`，开启“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择项目目录下的 `chrome-extension` 文件夹。
4. 在任意登录页面点击扩展图标，可先点“唤起 dumu”，再“读取当前页”并“保存到 dumu”。
5. 若本地接口不可达，扩展会自动尝试 `dumu://focus` 系统协议唤起应用。

> 说明：扩展通过本地接口 `http://127.0.0.1:32123/quick-save` 写入 dumu，不经过远程网络。
