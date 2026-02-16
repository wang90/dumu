const API_BASES = ["http://127.0.0.1:32123", "http://localhost:32123"];

const titleInput = document.querySelector("#title");
const usernameInput = document.querySelector("#username");
const passwordInput = document.querySelector("#password");
const notesInput = document.querySelector("#notes");
const wakeBtn = document.querySelector("#wakeBtn");
const readBtn = document.querySelector("#readBtn");
const saveBtn = document.querySelector("#saveBtn");
const statusEl = document.querySelector("#status");

function setStatus(message, type = "") {
  statusEl.textContent = message || "";
  statusEl.className = `status ${type}`.trim();
}

async function getCurrentTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function readFromCurrentPage() {
  const tab = await getCurrentTab();
  if (!tab?.id) {
    throw new Error("未找到当前标签页");
  }

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const textInputs = Array.from(
        document.querySelectorAll(
          'input[type="text"], input[type="email"], input[autocomplete="username"], input[name*="user" i], input[name*="email" i]'
        )
      );
      const passwordInputs = Array.from(document.querySelectorAll('input[type="password"]'));
      const username = (() => {
        const nonEmpty = textInputs.find((item) => String(item.value || "").trim());
        return nonEmpty ? String(nonEmpty.value || "").trim() : "";
      })();
      const password = (() => {
        const nonEmpty = passwordInputs.find((item) => String(item.value || "").trim());
        return nonEmpty ? String(nonEmpty.value || "").trim() : "";
      })();
      return {
        title: document.title || "",
        url: location.href || "",
        username,
        password,
      };
    },
  });

  return results?.[0]?.result || {};
}

async function fillFromPage() {
  try {
    setStatus("正在读取页面...", "");
    const data = await readFromCurrentPage();
    titleInput.value = String(data.title || "").trim();
    usernameInput.value = String(data.username || "").trim();
    passwordInput.value = String(data.password || "").trim();
    setStatus("已读取当前页面，可直接保存。", "ok");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`读取失败：${message}`, "error");
  }
}

async function saveToDumu() {
  const tab = await getCurrentTab();
  const payload = {
    title: String(titleInput.value || "").trim(),
    username: String(usernameInput.value || "").trim(),
    password: String(passwordInput.value || "").trim(),
    notes: String(notesInput.value || "").trim(),
    url: String(tab?.url || "").trim(),
  };

  if (!payload.title || !payload.username || !payload.password) {
    setStatus("标题、账号、密码不能为空", "error");
    return;
  }

  try {
    setStatus("正在保存...", "");
    let lastError = "";
    for (const baseUrl of API_BASES) {
      try {
        const apiUrl = `${baseUrl}/quick-save`;
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok || !data.ok) {
          throw new Error(data.error || `请求失败（${response.status}）`);
        }
        setStatus("已保存到 dumu。", "ok");
        return;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }
    throw new Error(lastError || "无法连接到 dumu 本地服务");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(
      `保存失败：${message}。请确认 dumu 正在运行，并重启应用后重试。`,
      "error"
    );
  }
}

async function wakeDumu() {
  try {
    setStatus("正在唤起 dumu...", "");
    let lastError = "";
    for (const baseUrl of API_BASES) {
      try {
        const response = await fetch(`${baseUrl}/focus`, {
          method: "POST",
          mode: "no-cors",
        });
        setStatus("已唤起 dumu。", "ok");
        return;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }
    chrome.tabs.create({ url: "dumu://focus" });
    setStatus("已尝试通过系统协议唤起 dumu。", "ok");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    setStatus(`唤起失败：${message}。请先启动 dumu。`, "error");
  }
}

wakeBtn.addEventListener("click", wakeDumu);
readBtn.addEventListener("click", fillFromPage);
saveBtn.addEventListener("click", saveToDumu);

fillFromPage();
