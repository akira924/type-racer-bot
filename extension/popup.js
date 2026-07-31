const extractBtn = document.getElementById("extract");
const startBtn = document.getElementById("start");
const wpmInput = document.getElementById("wpm");
const output = document.getElementById("output");
const meta = document.getElementById("meta");

function clampWpm(value) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return 100;
  return Math.min(200, Math.max(50, n));
}

extractBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    output.value = "No active tab found.";
    return;
  }

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_TEXT" });
    if (!response?.text) {
      output.value = "";
      meta.textContent = response?.error ?? "No text found on this page.";
      return;
    }
    output.value = response.text;
    meta.textContent = `${response.text.length} characters`;
  } catch (err) {
    output.value = "";
    meta.textContent =
      "Could not reach the page. Reload the tab after installing the extension.";
    console.error(err);
  }
});

startBtn.addEventListener("click", async () => {
  const text = output.value.trim();
  if (!text) {
    meta.textContent = "Extract text first, then click Start.";
    return;
  }

  const wpm = clampWpm(wpmInput.value);
  wpmInput.value = String(wpm);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    meta.textContent = "No active tab found.";
    return;
  }

  meta.textContent = `Typing at ${wpm} WPM…`;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "START_TYPING",
      text,
      wpm,
    });

    if (!response?.success) {
      meta.textContent = response?.error ?? "Typing failed.";
      return;
    }

    meta.textContent = `Finished typing at ${wpm} WPM.`;
  } catch (err) {
    meta.textContent =
      "Could not reach the page. Reload the tab after installing the extension.";
    console.error(err);
  }
});

wpmInput.addEventListener("change", () => {
  wpmInput.value = String(clampWpm(wpmInput.value));
});
