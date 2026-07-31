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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function charToKeyCode(char) {
  if (char === " ") return 32;
  const upper = char.toUpperCase();
  if (upper >= "A" && upper <= "Z") return upper.charCodeAt(0);
  return char.charCodeAt(0);
}

function charToCode(char) {
  if (char === " ") return "Space";
  if (char >= "a" && char <= "z") return `Key${char.toUpperCase()}`;
  if (char >= "A" && char <= "Z") return `Key${char}`;
  if (char >= "0" && char <= "9") return `Digit${char}`;
  return "";
}

function dispatchChar(element, char) {
  const keyCode = charToKeyCode(char);
  const eventInit = {
    key: char,
    code: charToCode(char),
    keyCode,
    which: keyCode,
    charCode: char.charCodeAt(0),
    bubbles: true,
    cancelable: true,
  };

  element.dispatchEvent(new KeyboardEvent("keydown", eventInit));
  element.dispatchEvent(new KeyboardEvent("keypress", eventInit));

  if (element.isContentEditable) {
    document.execCommand("insertText", false, char);
  } else {
    const start = element.selectionStart ?? element.value.length;
    const end = element.selectionEnd ?? element.value.length;
    const value = element.value ?? "";
    element.value = value.slice(0, start) + char + value.slice(end);
    element.selectionStart = element.selectionEnd = start + 1;
  }

  element.dispatchEvent(
    new InputEvent("input", {
      data: char,
      inputType: "insertText",
      bubbles: true,
      cancelable: true,
    })
  );
  element.dispatchEvent(new KeyboardEvent("keyup", eventInit));
}

/**
 * Focus the TypeRacer input and type text at the given WPM.
 * WPM uses the standard 5-characters-per-word convention.
 */
async function startTyping(text, wpm) {
  const input = document.querySelector(".txtInput");
  if (!input) {
    return { success: false, error: "Input field (.txtInput) not found on this page." };
  }

  input.focus();
  input.click();

  const msPerChar = 60000 / (wpm * 5);

  for (const char of text) {
    dispatchChar(input, char);
    await sleep(msPerChar);
  }

  return { success: true };
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_PAGE_TEXT") {
    sendResponse(extractPageText());
    return true;
  }

  if (message.type === "START_TYPING") {
    startTyping(message.text, message.wpm)
      .then(sendResponse)
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }

  return true;
});
