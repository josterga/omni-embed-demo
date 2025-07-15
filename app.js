// app.js
document.addEventListener("DOMContentLoaded", () => {
  const sessionSelect = document.getElementById("sessionSelect");
  const customUrl = document.getElementById("customUrl");
  const loadBtn = document.getElementById("loadBtn");
  const embedFrame = document.getElementById("embedFrame");
  const errorMsg = document.getElementById("errorMsg");

  const SESSIONS_JSON = "sessions.json"; // static file in repo

  // Load session URLs from JSON
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
    .catch(err => {
      console.error("Failed to load session list", err);
      errorMsg.textContent = "Could not load session list.";
    });

  loadBtn.addEventListener("click", () => {
    errorMsg.textContent = "";
    let url = customUrl.value.trim() || sessionSelect.value;

    if (!url) {
      errorMsg.textContent = "Please select or enter a session URL.";
      return;
    }

    if (!url.startsWith("http")) {
      errorMsg.textContent = "Invalid URL format.";
      return;
    }

    embedFrame.src = url;
  });
});
