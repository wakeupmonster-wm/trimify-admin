// Self-hosted TinyMCE assets (skins/plugins/themes/icons/models) have to be
// served as static files for tinymceScriptSrc to work — this copies just the
// runtime pieces from node_modules into public/tinymce so Vite serves them
// at /tinymce/*. Runs automatically after `npm install` (see postinstall).
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "node_modules", "tinymce");
const dest = path.join(__dirname, "..", "public", "tinymce");

if (!fs.existsSync(src)) {
  console.warn("[copy-tinymce] node_modules/tinymce not found, skipping.");
  process.exit(0);
}

const items = ["icons", "models", "plugins", "skins", "themes", "tinymce.min.js"];

fs.mkdirSync(dest, { recursive: true });

for (const item of items) {
  const from = path.join(src, item);
  const to = path.join(dest, item);
  if (!fs.existsSync(from)) continue;
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}

console.log("[copy-tinymce] Copied TinyMCE runtime assets to public/tinymce");
