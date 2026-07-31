const extractBtn = document.getElementById("extract");
const output = document.getElementById("output");
const meta = document.getElementById("meta");

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
