/**
 * Extract passage text from the element immediately before #smoothCaret.
 */
function extractPageText() {
  const caret = document.getElementById("smoothCaret");
  if (!caret) {
    return { text: null, error: "#smoothCaret not found on this page." };
  }

  const passage = caret.previousElementSibling;
  if (!passage) {
    return { text: null, error: "No text element found above #smoothCaret." };
  }

  const text = passage.textContent.trim();
  if (!text) {
    return { text: null, error: "Text element above #smoothCaret is empty." };
  }

  return { text };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PAGE_TEXT") {
    sendResponse(extractPageText());
  }
  return true;
});
