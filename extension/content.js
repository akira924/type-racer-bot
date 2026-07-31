/**
 * Extract text from the page. Customize selectors for your target site.
 */
function extractPageText() {
  // TypeRacer: the passage to type lives in .input .txtInput (or similar)
  const typeracerPassage = document.querySelector(".input .txtInput");
  if (typeracerPassage) {
    return {
      source: "typeracer",
      text: typeracerPassage.textContent.trim(),
    };
  }

  // Generic fallback: visible text from main content areas
  const main =
    document.querySelector("main") ||
    document.querySelector("article") ||
    document.querySelector('[role="main"]') ||
    document.body;

  return {
    source: "generic",
    text: main.innerText.trim(),
  };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PAGE_TEXT") {
    sendResponse(extractPageText());
  }
  return true;
});
