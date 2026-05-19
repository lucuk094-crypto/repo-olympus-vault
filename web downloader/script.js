const form = document.querySelector("#downloadForm");
const mediaUrlInput = document.querySelector("#mediaUrl");
const analyzeButton = document.querySelector("#analyzeButton");
const urlHint = document.querySelector("#urlHint");
const statusPanel = document.querySelector("#statusPanel");
const statusTitle = document.querySelector("#statusTitle");
const statusMessage = document.querySelector("#statusMessage");
const resultPanel = document.querySelector("#resultPanel");
const resultPlatform = document.querySelector("#resultPlatform");
const resultTitle = document.querySelector("#resultTitle");
const resultThumb = document.querySelector("#resultThumb");
const downloadList = document.querySelector("#downloadList");
const template = document.querySelector("#downloadItemTemplate");
const settingsToggle = document.querySelector("#settingsToggle");
const settingsPanel = document.querySelector("#settingsPanel");
const apiEndpointInput = document.querySelector("#apiEndpoint");
const saveEndpoint = document.querySelector("#saveEndpoint");
const clearHistory = document.querySelector("#clearHistory");
const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const platformPills = [...document.querySelectorAll(".platform-pill")];

const STORAGE_KEY = "medialink-history";
const ENDPOINT_KEY = "medialink-endpoint";
const DEFAULT_ENDPOINT = "http://localhost:3000/api/meta/download";

const directMediaPattern =
  /\.(mp4|mov|webm|m4v|jpg|jpeg|png|gif|webp)(\?.*)?$/i;

const platformMatchers = [
  { id: "tiktok", label: "TikTok", pattern: /(^|\.)tiktok\.com$/i },
  {
    id: "youtube",
    label: "YouTube",
    pattern: /(^|\.)youtube\.com$|(^|\.)youtu\.be$/i,
  },
  { id: "facebook", label: "Facebook", pattern: /(^|\.)facebook\.com$|(^|\.)fb\.watch$/i },
  {
    id: "twitter",
    label: "X/Twitter",
    pattern: /(^|\.)twitter\.com$|(^|\.)x\.com$/i,
  },
];

apiEndpointInput.value = localStorage.getItem(ENDPOINT_KEY) || DEFAULT_ENDPOINT;
renderHistory();

mediaUrlInput.addEventListener("input", () => {
  const parsed = parseInputUrl(mediaUrlInput.value);
  setActivePlatform(parsed.platform?.id);
  urlHint.textContent = parsed.platform
    ? `Terdeteksi ${parsed.platform.label}.`
    : "Mendukung URL langsung gambar/video dan endpoint API untuk platform sosial.";
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const parsed = parseInputUrl(mediaUrlInput.value);

  if (!parsed.url) {
    showWarning("URL tidak valid", "Periksa kembali alamat yang ditempel.");
    return;
  }

  setLoading(true, "Memproses URL", "Menganalisis alamat media...");
  clearResults();

  try {
    const data = directMediaPattern.test(parsed.url.href)
      ? createDirectMediaResult(parsed.url)
      : await fetchSocialMediaResult(parsed.url, parsed.platform);

    renderResult(data);
    saveHistory(data, parsed.url.href);
    renderHistory();
    setLoading(false);
  } catch (error) {
    showWarning("Belum bisa mengambil media", error.message);
  }
});

settingsToggle.addEventListener("click", () => {
  settingsPanel.hidden = !settingsPanel.hidden;
});

saveEndpoint.addEventListener("click", () => {
  const endpoint = apiEndpointInput.value.trim() || DEFAULT_ENDPOINT;
  localStorage.setItem(ENDPOINT_KEY, endpoint);
  apiEndpointInput.value = endpoint;
  showWarning("Endpoint tersimpan", "Aplikasi akan memakai endpoint ini untuk URL sosial media.");
});

clearHistory.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
});

function parseInputUrl(value) {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./i, "");
    const platform = platformMatchers.find((item) => item.pattern.test(host));
    return { url, platform };
  } catch {
    return { url: null, platform: null };
  }
}

function setActivePlatform(platformId) {
  platformPills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.platform === platformId);
  });
}

function setLoading(isLoading, title = "", message = "") {
  analyzeButton.disabled = isLoading;
  statusPanel.hidden = !isLoading;
  statusPanel.classList.remove("warning");
  if (title) statusTitle.textContent = title;
  if (message) statusMessage.textContent = message;
}

function showWarning(title, message) {
  analyzeButton.disabled = false;
  statusPanel.hidden = false;
  statusPanel.classList.add("warning");
  statusTitle.textContent = title;
  statusMessage.textContent = message;
}

function clearResults() {
  resultPanel.hidden = true;
  downloadList.innerHTML = "";
  resultThumb.hidden = true;
  resultThumb.removeAttribute("src");
}

function createDirectMediaResult(url) {
  const isImage = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url.href);
  const filename = decodeURIComponent(url.pathname.split("/").pop()) || "media";

  return {
    title: filename,
    platform: "URL Langsung",
    thumbnail: isImage ? url.href : "",
    items: [
      {
        type: isImage ? "Foto" : "Video",
        quality: "Original",
        url: url.href,
        filename,
      },
    ],
  };
}

async function fetchSocialMediaResult(url, platform) {
  const endpoint = localStorage.getItem(ENDPOINT_KEY) || DEFAULT_ENDPOINT;
  const requestUrl = buildRequestUrl(endpoint, url.href);

  const response = await fetch(requestUrl, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `${platform?.label || "Platform"} membutuhkan endpoint serverless aktif. Pastikan ${endpoint} sudah tersedia di deploy kamu.`,
    );
  }

  const data = await response.json();
  if (!Array.isArray(data.items) || data.items.length === 0) {
    throw new Error("Endpoint tidak mengembalikan daftar file yang bisa diunduh.");
  }

  return {
    title: data.title || platform?.label || "Media sosial",
    platform: data.platform || platform?.label || "Media sosial",
    thumbnail: data.thumbnail || "",
    items: data.items.map((item, index) => ({
      type: item.type || "Media",
      quality: item.quality || `File ${index + 1}`,
      url: item.url,
      filename: item.filename || `media-${index + 1}`,
    })),
  };
}

function buildRequestUrl(endpoint, mediaUrl) {
  try {
    const requestUrl = new URL(endpoint);
    requestUrl.searchParams.set("url", mediaUrl);
    return requestUrl.href;
  } catch {
    const separator = endpoint.includes("?") ? "&" : "?";
    return `${endpoint}${separator}url=${encodeURIComponent(mediaUrl)}`;
  }
}

function renderResult(data) {
  resultPanel.hidden = false;
  resultPlatform.textContent = data.platform;
  resultTitle.textContent = data.title;
  downloadList.innerHTML = "";

  if (data.thumbnail) {
    resultThumb.src = data.thumbnail;
    resultThumb.hidden = false;
  }

  data.items.forEach((item) => {
    const node = template.content.firstElementChild.cloneNode(true);
    node.querySelector("h3").textContent = `${item.type} · ${item.quality}`;
    node.querySelector("p").textContent = item.filename;

    const link = node.querySelector("a");
    link.href = item.url;
    link.download = item.filename;
    link.addEventListener("click", () => addDownloadMarker(data.title));

    downloadList.appendChild(node);
  });
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveHistory(data, sourceUrl) {
  const history = getHistory();
  const entry = {
    title: data.title,
    platform: data.platform,
    url: sourceUrl,
    at: new Date().toISOString(),
  };

  const next = [entry, ...history.filter((item) => item.url !== sourceUrl)].slice(0, 8);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function addDownloadMarker(title) {
  urlHint.textContent = `Download dibuka untuk ${title}.`;
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = "";
  historyCount.textContent = `${history.length} item`;

  if (history.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Belum ada URL yang diproses.";
    historyList.appendChild(empty);
    return;
  }

  history.forEach((item) => {
    const row = document.createElement("article");
    row.className = "history-item";

    const text = document.createElement("div");
    const title = document.createElement("h3");
    const meta = document.createElement("p");
    title.textContent = item.title;
    meta.textContent = `${item.platform} · ${formatDate(item.at)}`;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Buka";
    button.addEventListener("click", () => {
      mediaUrlInput.value = item.url;
      mediaUrlInput.dispatchEvent(new Event("input"));
      mediaUrlInput.focus();
    });

    text.append(title, meta);
    row.append(text, button);
    historyList.appendChild(row);
  });
}

function formatDate(value) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
