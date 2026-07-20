document.addEventListener("DOMContentLoaded", () => {
  const sessionSelect = document.getElementById("sessionSelect");
  const customUrl = document.getElementById("customUrl");
  const addSessionBtn = document.getElementById("addSessionBtn");
  const sessionError = document.getElementById("sessionError");
  const directInput = document.getElementById("directInput");
  const addDirectBtn = document.getElementById("addDirectBtn");
  const directError = document.getElementById("directError");
  const framesContainer = document.getElementById("frames-container");

  const SESSIONS_JSON = "sessions.json";
  const frames = [];

  function addIframe(url) {
    const wrapper = document.createElement("div");
    wrapper.className = "frame-wrapper";

    const iframe = document.createElement("iframe");
    iframe.src = url;
    iframe.allow = "clipboard-write; microphone";
    iframe.allowFullscreen = true;

    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => {
      const idx = frames.indexOf(iframe);
      if (idx !== -1) frames.splice(idx, 1);
      wrapper.remove();
    });

    wrapper.appendChild(iframe);
    wrapper.appendChild(removeBtn);
    framesContainer.appendChild(wrapper);
    frames.push(iframe);
  }

  function extractSrc(raw) {
    const trimmed = raw.trim();
    if (trimmed.startsWith("<")) {
      const doc = new DOMParser().parseFromString(trimmed, "text/html");
      const el = doc.querySelector("iframe");
      return el ? el.getAttribute("src") : null;
    }
    return trimmed;
  }

  window.addEventListener("message", (event) => {
    if (!event.data || event.data.type !== "size") return;
    const { height, width } = event.data;
    for (const frame of frames) {
      if (event.source === frame.contentWindow) {
        if (height) frame.style.height = `${height}px`;
        if (width) frame.style.width = `${width}px`;
        break;
      }
    }
  });

  fetch(SESSIONS_JSON)
    .then(res => res.json())
    .then(data => {
      data.sessions.forEach(session => {
        const opt = document.createElement("option");
        opt.value = session.url;
        opt.textContent = session.name;
        sessionSelect.appendChild(opt);
      });
    })
    .catch(() => {
      sessionError.textContent = "Could not load session list.";
    });

  addDirectBtn.addEventListener("click", () => {
    directError.textContent = "";
    const url = extractSrc(directInput.value);
    if (!url || !url.startsWith("http")) {
      directError.textContent = "Please enter a valid URL or <iframe> tag.";
      return;
    }
    addIframe(url);
    directInput.value = "";
  });

  addSessionBtn.addEventListener("click", () => {
    sessionError.textContent = "";
    const url = customUrl.value.trim() || sessionSelect.value;
    if (!url) {
      sessionError.textContent = "Please select or enter a session URL.";
      return;
    }
    if (!url.startsWith("http")) {
      sessionError.textContent = "Invalid URL format.";
      return;
    }
    addIframe(url);
    customUrl.value = "";
    sessionSelect.value = "";
  });
});
