# Page Text Extractor (Chrome Extension)

A minimal Chrome extension that reads text from the active web page.

## Load in Chrome

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `extension` folder in this project

## Usage

1. Navigate to the page you want text from (e.g. a TypeRacer race)
2. Click the extension icon
3. Click **Extract text from page**

## Customizing selectors

Edit `extension/content.js` and add CSS selectors for your target site. TypeRacer is already handled via `.input .txtInput`.

## Project structure

```
extension/
  manifest.json   # Extension config (Manifest V3)
  content.js      # Runs on pages, extracts text
  popup.html      # Extension popup UI
  popup.js        # Popup logic
```
