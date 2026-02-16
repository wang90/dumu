import { useEffect, useMemo, useRef, useState } from "react";

const emptyForm = {
  title: "",
  username: "",
  password: "",
  notes: "",
};
const THEME_STORAGE_KEY = "dumu_theme_mode";

function resolveTheme(mode) {
  if (mode === "light" || mode === "dark") return mode;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="M12 5C6.5 5 2.1 8.3 1 12c1.1 3.7 5.5 7 11 7s9.9-3.3 11-7c-1.1-3.7-5.5-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        d="m3.3 2 18.7 18.7-1.4 1.4-3.2-3.2A12 12 0 0 1 12 19c-5.5 0-9.9-3.3-11-7 .5-1.9 1.8-3.6 3.5-4.8L1.9 3.4 3.3 2Zm4 6 1.5 1.5a4 4 0 0 0 5.7 5.7l1.5 1.5A6 6 0 0 1 7.3 8Zm4.6-3c5.5 0 9.9 3.3 11 7-.4 1.5-1.3 2.9-2.5 4.1l-1.5-1.5c.8-.8 1.5-1.7 1.8-2.6-1.1-3-4.8-5.5-8.8-5.5-.8 0-1.6.1-2.4.3L8.3 5.6A12.6 12.6 0 0 1 11.9 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.7 12.3-1.4 1.4L12 13.4l-2.3 2.3-1.4-1.4 2.3-2.3-2.3-2.3 1.4-1.4 2.3 2.3 2.3-2.3 1.4 1.4-2.3 2.3 2.3 2.3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" aria-hidden="true">
      <rect x="10" y="24" width="44" height="28" rx="6" fill="#1a2437" />
      <path
        d="M14 24h36l-3.4-8.4A4 4 0 0 0 42.9 13H21.1a4 4 0 0 0-3.7 2.6L14 24Z"
        fill="#2e4a80"
      />
      <path
        d="M10 35h16a6 6 0 0 0 12 0h16"
        fill="none"
        stroke="#6f8cc7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="23" cy="41" r="1.5" fill="#8ba4d8" />
      <circle cx="41" cy="41" r="1.5" fill="#8ba4d8" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M15.5 2.8A9 9 0 1 0 21.2 15a7.8 7.8 0 1 1-5.7-12.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" fill="currentColor" />
      <rect x="10" y="18" width="4" height="2" rx="1" fill="currentColor" />
      <rect x="8" y="20" width="8" height="1.6" rx="0.8" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm9.2 3.2-.1-.2-2-.7a7 7 0 0 0-.5-1.3l1-1.9-.2-.2-1.8-1.8-.2-.2-1.9 1a7 7 0 0 0-1.3-.5l-.7-2-.2-.1h-2.6l-.2.1-.7 2a7 7 0 0 0-1.3.5l-1.9-1-.2.2-1.8 1.8-.2.2 1 1.9a7 7 0 0 0-.5 1.3l-2 .7-.1.2v2.6l.1.2 2 .7c.1.4.3.9.5 1.3l-1 1.9.2.2 1.8 1.8.2.2 1.9-1c.4.2.9.4 1.3.5l.7 2 .2.1h2.6l.2-.1.7-2c.4-.1.9-.3 1.3-.5l1.9 1 .2-.2 1.8-1.8.2-.2-1-1.9c.2-.4.4-.9.5-1.3l2-.7.1-.2V12Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getNextThemeMode(mode) {
  if (mode === "system") return "light";
  if (mode === "light") return "dark";
  return "system";
}

function App() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isClosingForm, setIsClosingForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [showPasswordColumn, setShowPasswordColumn] = useState(false);
  const [hoverTip, setHoverTip] = useState({
    visible: false,
    key: "",
    text: "",
    x: 0,
    y: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [initialForm, setInitialForm] = useState(emptyForm);
  const [keyword, setKeyword] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [themeMode, setThemeMode] = useState(() => {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
    return "system";
  });
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    title: false,
    username: false,
    password: false,
  });
  const settingsRef = useRef(null);
  const titleInputRef = useRef(null);
  const usernameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const filteredAccounts = useMemo(() => {
    const key = keyword.trim().toLowerCase();
    if (!key) return accounts;
    return accounts.filter((item) =>
      [item.title, item.username, item.notes]
        .join(" ")
        .toLowerCase()
        .includes(key)
    );
  }, [accounts, keyword]);

  const filteredIds = useMemo(
    () => filteredAccounts.map((item) => item.id),
    [filteredAccounts]
  );

  const selectedInFilteredCount = useMemo(
    () => filteredIds.filter((id) => selectedIds.includes(id)).length,
    [filteredIds, selectedIds]
  );

  const isAllFilteredSelected =
    filteredIds.length > 0 && selectedInFilteredCount === filteredIds.length;

  const duplicateHints = useMemo(() => {
    const title = form.title.trim().toLowerCase();
    const username = form.username.trim().toLowerCase();
    const password = form.password.trim();
    if (!title && !username && !password) return [];

    const others = accounts.filter((item) => item.id !== editingId);
    const hints = [];

    const hasSameTitleAndUsername =
      title &&
      username &&
      others.some(
        (item) =>
          String(item.title || "").trim().toLowerCase() === title &&
          String(item.username || "").trim().toLowerCase() === username
      );

    const hasSamePassword =
      password &&
      others.some((item) => String(item.password || "").trim() === password);

    if (hasSameTitleAndUsername) {
      hints.push("检测到相同“标题 + 账号”的记录，可继续保存。");
    }
    if (hasSamePassword) {
      hints.push("检测到相同密码记录，可继续保存。");
    }
    return hints;
  }, [accounts, editingId, form.password, form.title, form.username]);

  const hasDuplicateTitle = useMemo(() => {
    const title = form.title.trim().toLowerCase();
    if (!title) return false;
    return accounts
      .filter((item) => item.id !== editingId)
      .some((item) => String(item.title || "").trim().toLowerCase() === title);
  }, [accounts, editingId, form.title]);

  async function loadAccounts() {
    setLoading(true);
    try {
      const rows = await window.dumuApi.listAccounts();
      const normalizedRows = Array.isArray(rows) ? rows : [];
      setAccounts(normalizedRows);
      setSelectedIds((prev) =>
        prev.filter((id) => normalizedRows.some((item) => item.id === id))
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (typeof window.dumuApi?.onAccountsRefresh !== "function") return undefined;
    const unsubscribe = window.dumuApi.onAccountsRefresh(() => {
      loadAccounts();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const theme = resolveTheme(themeMode);
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    };

    applyTheme();
    if (themeMode === "system") {
      media.addEventListener("change", applyTheme);
      return () => media.removeEventListener("change", applyTheme);
    }
    return undefined;
  }, [themeMode]);

  useEffect(() => {
    function onClickOutside(event) {
      if (!settingsRef.current) return;
      if (!settingsRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function onFieldChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setInitialForm(emptyForm);
    setEditingId(null);
    setIsClosingForm(false);
    setShowCreateForm(false);
    setShowPassword(false);
    setVisiblePasswords({});
    setShowPasswordColumn(false);
    setFieldErrors({
      title: false,
      username: false,
      password: false,
    });
  }

  function openForm() {
    setIsClosingForm(false);
    setForm(emptyForm);
    setInitialForm(emptyForm);
    setEditingId(null);
    setShowCreateForm(true);
    setFieldErrors({
      title: false,
      username: false,
      password: false,
    });
  }

  function closeFormWithAnimation() {
    setIsClosingForm(true);
    window.setTimeout(() => {
      resetForm();
    }, 220);
  }

  function hasFormChanged() {
    const keys = ["title", "username", "password", "notes"];
    return keys.some((key) => String(form[key] || "") !== String(initialForm[key] || ""));
  }

  function closeFormWithConfirm() {
    if (hasFormChanged()) {
      const ok = window.confirm("你有未保存的内容，确定要关闭吗？");
      if (!ok) return;
    }
    closeFormWithAnimation();
  }

  function openNewFormWithConfirm() {
    if (showCreateForm && hasFormChanged()) {
      const ok = window.confirm("你有未保存的内容，确定要关闭吗？");
      if (!ok) return;
    }
    openForm();
  }

  async function onSubmit(event) {
    event.preventDefault();
    const missingFields = [];
    if (!form.title.trim()) missingFields.push("title");
    if (!form.username.trim()) missingFields.push("username");
    if (!form.password.trim()) missingFields.push("password");

    if (missingFields.length > 0) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        missingFields.forEach((field) => {
          next[field] = true;
        });
        return next;
      });

      const firstField = missingFields[0];
      if (firstField === "title") titleInputRef.current?.focus();
      if (firstField === "username") usernameInputRef.current?.focus();
      if (firstField === "password") passwordInputRef.current?.focus();
      return;
    }
    setSaving(true);
    try {
      const wasSearching = keyword.trim().length > 0;
      const payload = {
        title: form.title.trim(),
        username: form.username.trim(),
        password: form.password.trim(),
        notes: form.notes.trim(),
      };
      if (editingId) {
        await window.dumuApi.updateAccount({ id: editingId, ...payload });
      } else {
        await window.dumuApi.createAccount(payload);
      }
      await loadAccounts();
      if (wasSearching) {
        setKeyword("");
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item) {
    if (showCreateForm && hasFormChanged()) {
      const ok = window.confirm("你有未保存的内容，确定要关闭吗？");
      if (!ok) return;
    }
    openForm();
    const nextForm = {
      title: item.title || "",
      username: item.username || "",
      password: item.password || "",
      notes: item.notes || "",
    };
    setEditingId(item.id);
    setForm(nextForm);
    setInitialForm(nextForm);
  }

  async function removeItem(id) {
    if (!window.confirm("确认删除这条记录吗？")) return;
    await window.dumuApi.deleteAccount(id);
    await loadAccounts();
    if (editingId === id) resetForm();
  }

  function toggleSelectOne(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  function toggleSelectAllFiltered() {
    if (isAllFilteredSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredIds.includes(id)));
      return;
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredIds.forEach((id) => next.add(id));
      return Array.from(next);
    });
  }

  async function batchDeleteSelected() {
    if (selectedIds.length === 0) return;
    const ok = window.confirm(`确认批量删除 ${selectedIds.length} 条记录吗？`);
    if (!ok) return;
    await Promise.all(selectedIds.map((id) => window.dumuApi.deleteAccount(id)));
    setSelectedIds([]);
    await loadAccounts();
    if (editingId && selectedIds.includes(editingId)) {
      resetForm();
    }
  }

  async function exportData() {
    const result = await window.dumuApi.exportAccounts();
    if (!result?.canceled) {
      window.alert(`导出成功: ${result.filePath}`);
    }
  }

  async function importData() {
    const result = await window.dumuApi.importAccounts();
    if (!result?.canceled) {
      await loadAccounts();
      window.alert(`导入完成，共 ${result.count} 条`);
    }
  }

  async function importChromeCsv() {
    try {
      if (typeof window.dumuApi?.importChromeCsv !== "function") {
        window.alert("当前版本暂不支持该功能，请重启应用后再试。");
        return;
      }
      const result = await window.dumuApi.importChromeCsv();
      if (!result?.canceled) {
        await loadAccounts();
        const skipped = Number(result.skipped || 0);
        const skipText = skipped > 0 ? `，跳过 ${skipped} 条不完整记录` : "";
        window.alert(`Chrome CSV 导入完成，共 ${result.count} 条${skipText}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      window.alert(`获取 Chrome 密码失败：${message}`);
    }
  }

  async function copyText(text) {
    await navigator.clipboard.writeText(text || "");
    window.alert("已复制");
  }

  function showAboutDumu() {
    window.alert(
      "Dumu\n\n本地账号管理工具\n数据仅保存在本机（SQLite）\n当前版本：0.0.0"
    );
  }

  function togglePasswordColumn() {
    setShowPasswordColumn((prev) => {
      const next = !prev;
      const nextRowState = {};
      accounts.forEach((item) => {
        nextRowState[item.id] = next;
      });
      setVisiblePasswords(nextRowState);
      return next;
    });
  }

  function toggleRowPassword(id) {
    setVisiblePasswords((prev) => {
      const currentVisible = showPasswordColumn || !!prev[id];
      const nextVisible = !currentVisible;
      const next = { ...prev, [id]: nextVisible };
      const allVisible =
        accounts.length > 0 &&
        accounts.every((item) => {
          if (item.id === id) return nextVisible;
          return showPasswordColumn || !!prev[item.id];
        });
      setShowPasswordColumn(allVisible);
      return next;
    });
  }

  function isRowPasswordVisible(id) {
    return showPasswordColumn || !!visiblePasswords[id];
  }

  function maskPassword(value) {
    const text = String(value || "");
    return "*".repeat(text.length);
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function renderHighlightedText(value) {
    const text = String(value || "");
    const key = keyword.trim();
    if (!key) return text;
    const regex = new RegExp(`(${escapeRegExp(key)})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, index) => {
      if (part.toLowerCase() === key.toLowerCase()) {
        return <mark key={`${part}-${index}`}>{part}</mark>;
      }
      return <span key={`${part}-${index}`}>{part}</span>;
    });
  }

  function getTipPosition(clientX, clientY) {
    const maxWidth = 520;
    let x = clientX + 14;
    let y = clientY + 14;
    if (x + maxWidth > window.innerWidth - 12) {
      x = Math.max(12, window.innerWidth - maxWidth - 12);
    }
    if (y + 44 > window.innerHeight - 12) {
      y = Math.max(12, clientY - 44);
    }
    return { x, y };
  }

  function openHoverTip(key, text, event) {
    const value = String(text || "");
    if (!value) {
      setHoverTip((prev) => ({ ...prev, visible: false }));
      return;
    }
    const { x, y } = getTipPosition(event.clientX, event.clientY);
    setHoverTip({ visible: true, key, text: value, x, y });
  }

  function moveHoverTip(event) {
    setHoverTip((prev) => {
      if (!prev.visible) return prev;
      const { x, y } = getTipPosition(event.clientX, event.clientY);
      return { ...prev, x, y };
    });
  }

  function closeHoverTip() {
    setHoverTip((prev) => ({ ...prev, visible: false }));
  }

  function getThemeLabel(mode) {
    if (mode === "light") return "白天";
    if (mode === "dark") return "夜晚";
    return "跟随系统";
  }

  function getThemeIcon(mode) {
    if (mode === "light") return <SunIcon />;
    if (mode === "dark") return <MoonIcon />;
    return <SystemIcon />;
  }

  function switchThemeMode() {
    setThemeMode((prev) => getNextThemeMode(prev));
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Dumu</h1>
          <p>数据仅保存在本机 SQLite 数据库，不经过网络。</p>
        </div>
        <div className="header-actions">
          <button
            type="button"
            className="secondary-btn chrome-import-btn"
            onClick={importChromeCsv}
            title="从 Chrome 导出的 CSV 获取密码"
            aria-label="获取 Chrome 密码"
          >
            获取 Chrome 密码
          </button>
          <button
            type="button"
            className="theme-mode-btn secondary-btn icon-with-tip"
            onClick={openNewFormWithConfirm}
            data-tip="新建"
            title="新建"
            aria-label="新建"
          >
            <PlusIcon />
          </button>
          <button
            type="button"
            className="theme-mode-btn active icon-with-tip"
            onClick={switchThemeMode}
            data-tip="主题"
            title="主题"
            aria-label="主题"
          >
            {getThemeIcon(themeMode)}
          </button>
          <div className="settings-menu" ref={settingsRef}>
            <button
              type="button"
              className={`theme-mode-btn icon-with-tip ${showSettingsMenu ? "active" : ""}`}
              onClick={() => setShowSettingsMenu((prev) => !prev)}
              data-tip="设置"
              title="设置"
              aria-label="设置"
            >
              <SettingsIcon />
            </button>
            {showSettingsMenu && (
              <div className="settings-dropdown">
                <button
                  type="button"
                  className="settings-item"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    importChromeCsv();
                  }}
                >
                  导入 Chrome CSV
                </button>
                <button
                  type="button"
                  className="settings-item"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    importData();
                  }}
                >
                  导入 JSON
                </button>
                <button
                  type="button"
                  className="settings-item"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    exportData();
                  }}
                >
                  导出 JSON
                </button>
                <button
                  type="button"
                  className="settings-item"
                  onClick={() => {
                    setShowSettingsMenu(false);
                    showAboutDumu();
                  }}
                >
                  关于 Dumu
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showCreateForm && (
        <section
          className={`panel form-panel-expand ${isClosingForm ? "form-panel-collapse" : ""}`}
        >
          <div className="panel-head">
            <h2>{editingId ? "编辑记录" : "新建记录"}</h2>
            <button
              type="button"
              className="ghost secondary-btn"
              onClick={closeFormWithConfirm}
            >
              关闭
            </button>
          </div>
          <form onSubmit={onSubmit} className="form-grid">
            <label className="span-2">
              标题 *
              <input
                ref={titleInputRef}
                className={fieldErrors.title ? "input-error" : ""}
                name="title"
                value={form.title}
                onChange={onFieldChange}
                onFocus={() =>
                  setFieldErrors((prev) => ({ ...prev, title: false }))
                }
                placeholder="例如：GitHub / Apple ID"
              />
            </label>
            <label className="span-2">
              账号 *
              <input
                ref={usernameInputRef}
                className={fieldErrors.username ? "input-error" : ""}
                name="username"
                value={form.username}
                onChange={onFieldChange}
                onFocus={() =>
                  setFieldErrors((prev) => ({ ...prev, username: false }))
                }
                placeholder="用户名或邮箱"
              />
              {duplicateHints.map((hint) => (
                <p key={hint} className="field-tip warning">
                  {hint}
                </p>
              ))}
            </label>
            <label className="span-2">
              密码 *
              <div className="password-row">
                <input
                  ref={passwordInputRef}
                  className={fieldErrors.password ? "input-error" : ""}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onFieldChange}
                  onFocus={() =>
                    setFieldErrors((prev) => ({ ...prev, password: false }))
                  }
                  placeholder="密码"
                />
                <button
                  type="button"
                  className="ghost icon-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "隐藏密码" : "显示密码"}
                  aria-label={showPassword ? "隐藏密码" : "显示密码"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>
            <label className="span-2">
              备注
              <textarea
                name="notes"
                value={form.notes}
                onChange={onFieldChange}
                placeholder="可记录二步验证、恢复信息等"
                rows={2}
              />
              {hasDuplicateTitle && (
                <p className="field-tip">
                  提示：可在备注里补充用途、设备或更新时间，方便区分相似记录。
                </p>
              )}
            </label>
            <div className="form-actions span-2">
              <button type="submit" disabled={saving}>
                {saving ? "保存中..." : editingId ? "更新记录" : "新增记录"}
              </button>
              <button
                type="button"
                className="ghost secondary-btn"
                onClick={closeFormWithConfirm}
              >
                取消
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel list-panel">
        <div className="list-head">
          <h2>我的清单</h2>
          {selectedIds.length > 0 && (
            <button
              type="button"
              className="danger batch-delete-btn"
              onClick={batchDeleteSelected}
            >
              批量删除（{selectedIds.length}）
            </button>
          )}
          <div className={`search-box ${keyword ? "has-value" : ""}`}>
            <input
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="按标题/账号/备注搜索"
            />
            {keyword && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setKeyword("")}
                title="清空搜索"
                aria-label="清空搜索"
              >
                <ClearIcon />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="list-state">加载中...</div>
        ) : filteredAccounts.length === 0 ? (
          <div className="list-state">
            <EmptyStateIcon />
            <p>暂无数据</p>
          </div>
        ) : (
          <div className="table-wrap list-table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="select-col">
                    <input
                      type="checkbox"
                      checked={isAllFilteredSelected}
                      onChange={toggleSelectAllFiltered}
                      title="全选当前结果"
                      aria-label="全选当前结果"
                    />
                  </th>
                  <th>标题</th>
                  <th>账号</th>
                  <th>
                    <div className="password-head">
                      <span>密码</span>
                      <button
                        type="button"
                        className="ghost icon-btn small-icon-btn"
                        onClick={togglePasswordColumn}
                        title={showPasswordColumn ? "隐藏整列密码" : "显示整列密码"}
                        aria-label={showPasswordColumn ? "隐藏整列密码" : "显示整列密码"}
                      >
                        {showPasswordColumn ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                  </th>
                  <th>备注</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((item) => (
                  <tr key={item.id}>
                    <td className="select-col">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                        title="选择记录"
                        aria-label="选择记录"
                      />
                    </td>
                    <td>
                      <span
                        className="cell-text"
                        onMouseEnter={(event) =>
                          openHoverTip(`title-${item.id}`, item.title || "", event)
                        }
                        onMouseMove={moveHoverTip}
                        onMouseLeave={closeHoverTip}
                      >
                        {renderHighlightedText(item.title)}
                      </span>
                    </td>
                    <td>
                      <span
                        className="cell-text"
                        onMouseEnter={(event) =>
                          openHoverTip(`username-${item.id}`, item.username || "", event)
                        }
                        onMouseMove={moveHoverTip}
                        onMouseLeave={closeHoverTip}
                      >
                        {renderHighlightedText(item.username)}
                      </span>
                    </td>
                    <td className="mono">
                      <div className="password-cell">
                        <span
                          className="password-text"
                          onMouseEnter={(event) =>
                            openHoverTip(
                              `password-${item.id}`,
                              item.password || "",
                              event
                            )
                          }
                          onMouseMove={moveHoverTip}
                          onMouseLeave={closeHoverTip}
                        >
                          {renderHighlightedText(
                            isRowPasswordVisible(item.id)
                              ? item.password
                              : maskPassword(item.password)
                          )}
                        </span>
                        <button
                          type="button"
                          className="ghost icon-btn small-icon-btn"
                          onClick={() => toggleRowPassword(item.id)}
                          title={isRowPasswordVisible(item.id) ? "隐藏该条密码" : "显示该条密码"}
                          aria-label={isRowPasswordVisible(item.id) ? "隐藏该条密码" : "显示该条密码"}
                        >
                          {isRowPasswordVisible(item.id) ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                      </div>
                    </td>
                    <td>
                      <span
                        className="cell-text"
                        onMouseEnter={(event) =>
                          openHoverTip(`notes-${item.id}`, item.notes || "", event)
                        }
                        onMouseMove={moveHoverTip}
                        onMouseLeave={closeHoverTip}
                      >
                        {renderHighlightedText(item.notes)}
                      </span>
                    </td>
                    <td className="actions">
                      <div className="actions-inner">
                        <button className="action-btn" onClick={() => copyText(item.username)}>
                          复制账号
                        </button>
                        <button className="action-btn" onClick={() => copyText(item.password)}>
                          复制密码
                        </button>
                        <button className="action-btn" onClick={() => startEdit(item)}>
                          编辑
                        </button>
                        <button
                          className="action-btn danger"
                          onClick={() => removeItem(item.id)}
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {hoverTip.visible && (
        <div className="floating-tooltip" style={{ left: hoverTip.x, top: hoverTip.y }}>
          {hoverTip.text}
        </div>
      )}
    </div>
  );
}

export default App;
