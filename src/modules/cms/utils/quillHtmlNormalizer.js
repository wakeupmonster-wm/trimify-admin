/**
 * quillHtmlNormalizer.js
 *
 * Converts Quill v2 class-based HTML into self-contained portable HTML
 * with inline styles. This makes the HTML renderable by:
 *   - Mobile HTML renderers (react-native-render-html)
 *   - WebView components with no external stylesheet
 *   - Any HTML consumer that cannot load quill.snow.css
 *
 * Quill v2 problems this resolves:
 *   1. <li data-list="bullet">   → browser needs .ql-editor CSS to show •
 *   2. <li data-list="ordered">  → browser needs CSS counters to show 1. 2.
 *   3. class="ql-indent-N"       → requires quill.snow.css for padding
 *   4. class="ql-align-center"   → requires quill.snow.css for text-align
 *
 * This normalizer is run at SAVE TIME in the admin panel, before the HTML
 * is sent to the backend. Existing stored HTML is unchanged until re-saved.
 *
 * @param {string} html - Raw Quill v2 HTML string
 * @returns {string} - Self-contained HTML with inline styles
 */

/**
 * Inline style values for ql-indent-N levels.
 * Each level adds 1.5rem of left padding.
 */
const INDENT_STYLES = {
  "ql-indent-1": "padding-left:1.5rem;",
  "ql-indent-2": "padding-left:3rem;",
  "ql-indent-3": "padding-left:4.5rem;",
  "ql-indent-4": "padding-left:6rem;",
  "ql-indent-5": "padding-left:7.5rem;",
  "ql-indent-6": "padding-left:9rem;",
  "ql-indent-7": "padding-left:10.5rem;",
  "ql-indent-8": "padding-left:12rem;",
};

/**
 * Inline style values for ql-align-* classes.
 * We map ql-align-justify to text-align:left because justify alignment on narrow
 * mobile screens causes word fragmentation, massive gaps, and rendering bugs.
 */
const ALIGN_STYLES = {
  "ql-align-center":  "text-align:center;",
  "ql-align-right":   "text-align:right;",
  "ql-align-justify": "text-align:left;",
};

/**
 * Merges a new inline style string into an existing style attribute value.
 * Avoids duplicate properties.
 *
 * @param {string} existing - Existing style attribute value (may be empty)
 * @param {string} toAdd    - CSS property string to append e.g. "padding-left:1.5rem;"
 * @returns {string} - Merged style string
 */
function mergeStyles(existing, toAdd) {
  if (!existing) return toAdd;
  // Avoid duplicating if the property key is already set
  const propKey = toAdd.split(":")[0].trim();
  if (existing.includes(propKey)) return existing;
  return existing.trimEnd().replace(/;?$/, ";") + toAdd;
}

/**
 * Main normalizer function.
 * Uses DOMParser to walk the HTML tree and transform Quill-specific
 * attributes/classes into inline styles. Also cleans non-breaking spaces
 * and sets layout constraints.
 *
 * Falls back gracefully if DOMParser is unavailable (SSR / test environments).
 *
 * @param {string} html - Quill v2 HTML string
 * @returns {string} - Normalized, portable HTML string
 */
export function normalizeQuillHtml(html) {
  if (!html || typeof html !== "string" || html.trim() === "") return html;

  // ── 0. Clean non-breaking spaces and justify styles at string level ──
  // Replacing &nbsp; and \u00A0 with standard spaces resolves word fragmentation.
  let cleanHtml = html
    .replace(/&nbsp;/g, " ")
    .replace(/\u00A0/g, " ");

  // DOMParser is only available in browser environments
  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    // Fallback: return as-is (SSR or test env)
    return cleanHtml;
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(cleanHtml, "text/html");

  // Remove existing inline justify text alignment
  doc.querySelectorAll("[style]").forEach((el) => {
    let style = el.getAttribute("style") || "";
    if (style.includes("text-align:justify") || style.includes("text-align: justify")) {
      style = style.replace(/text-align\s*:\s*justify;?/g, "text-align:left;");
      el.setAttribute("style", style);
    }
  });

  // ── Convert list elements with list-style: none to normal divs ───────────
  // This removes duplicate bullet points on mobile HTML renderers which ignore list-style: none.
  doc.querySelectorAll("ul, ol").forEach((list) => {
    const listStyle = list.getAttribute("style") || "";
    if (/list-style\s*:\s*none/i.test(listStyle) || /list-style-type\s*:\s*none/i.test(listStyle)) {
      const div = doc.createElement("div");
      
      // Copy all attributes from list to div
      Array.from(list.attributes).forEach((attr) => {
        if (attr.name === "style") {
          // Remove list-style: none/list-style-type: none styles
          const cleanStyle = attr.value
            .replace(/list-style-type\s*:\s*none\s*(!important)?;?/gi, "")
            .replace(/list-style\s*:\s*none\s*(!important)?;?/gi, "");
          div.setAttribute("style", cleanStyle);
        } else {
          div.setAttribute(attr.name, attr.value);
        }
      });

      // Move children and convert internal li elements to divs
      while (list.firstChild) {
        const child = list.firstChild;
        if (child.nodeType === 1 && child.tagName === "LI") {
          const childDiv = doc.createElement("div");
          Array.from(child.attributes).forEach((attr) => {
            if (attr.name === "style") {
              const cleanStyle = attr.value
                .replace(/list-style-type\s*:\s*none\s*(!important)?;?/gi, "")
                .replace(/list-style\s*:\s*none\s*(!important)?;?/gi, "");
              childDiv.setAttribute("style", cleanStyle);
            } else {
              childDiv.setAttribute(attr.name, attr.value);
            }
          });
          while (child.firstChild) {
            childDiv.appendChild(child.firstChild);
          }
          div.appendChild(childDiv);
          list.removeChild(child);
        } else {
          div.appendChild(child);
        }
      }

      list.parentNode.replaceChild(div, list);
    }
  });

  // ── 1. Handle Quill v2 data-list attributes ──────────────────────────────
  // Process ordered list items
  doc.querySelectorAll('li[data-list="ordered"]').forEach((li) => {
    const existingStyle = li.getAttribute("style") || "";
    li.setAttribute(
      "style",
      mergeStyles(existingStyle, "list-style:decimal;margin-left:1.5rem;")
    );
    li.removeAttribute("data-list");
  });

  // Process bullet list items
  doc.querySelectorAll('li[data-list="bullet"]').forEach((li) => {
    const existingStyle = li.getAttribute("style") || "";
    li.setAttribute(
      "style",
      mergeStyles(existingStyle, "list-style:disc;margin-left:1.5rem;")
    );
    li.removeAttribute("data-list");
  });

  // Process checked list items (Quill checkbox lists)
  doc.querySelectorAll('li[data-list="checked"], li[data-list="unchecked"]').forEach((li) => {
    const existingStyle = li.getAttribute("style") || "";
    li.setAttribute(
      "style",
      mergeStyles(existingStyle, "list-style:none;margin-left:1rem;padding-left:0.5rem;")
    );
    li.removeAttribute("data-list");
  });

  // ── 2. Convert ql-indent-N classes to inline padding ─────────────────────
  Object.entries(INDENT_STYLES).forEach(([cls, style]) => {
    doc.querySelectorAll(`.${cls}`).forEach((el) => {
      const existingStyle = el.getAttribute("style") || "";
      el.setAttribute("style", mergeStyles(existingStyle, style));
      el.classList.remove(cls);
      if (!el.getAttribute("class") || el.getAttribute("class").trim() === "") {
        el.removeAttribute("class");
      }
    });
  });

  // ── 3. Convert ql-align-* classes to inline text-align ───────────────────
  Object.entries(ALIGN_STYLES).forEach(([cls, style]) => {
    doc.querySelectorAll(`.${cls}`).forEach((el) => {
      const existingStyle = el.getAttribute("style") || "";
      el.setAttribute("style", mergeStyles(existingStyle, style));
      el.classList.remove(cls);
      if (!el.getAttribute("class") || el.getAttribute("class").trim() === "") {
        el.removeAttribute("class");
      }
    });
  });

  // ── 4. Strip remaining ql-* classes (safety net) ─────────────────────────
  doc.querySelectorAll("[class]").forEach((el) => {
    const classes = el.getAttribute("class").split(" ");
    const filteredClasses = classes.filter((cls) => !cls.startsWith("ql-"));
    if (filteredClasses.length === 0) {
      el.removeAttribute("class");
    } else if (filteredClasses.length < classes.length) {
      el.setAttribute("class", filteredClasses.join(" "));
    }
  });

  // ── 5. Ensure ul/ol have display and padding styles ──────────────────────
  doc.querySelectorAll("ul, ol").forEach((list) => {
    const existingStyle = list.getAttribute("style") || "";
    let newStyle = existingStyle;
    if (!existingStyle.includes("display")) {
      newStyle = mergeStyles(newStyle, "display:block;");
    }
    if (!existingStyle.includes("padding-left")) {
      newStyle = mergeStyles(newStyle, "padding-left:1.5rem;");
    }
    list.setAttribute("style", newStyle);
  });

  // ── 6. Formatting manual list items and ensuring wrapping ────────────────
  doc.querySelectorAll("li").forEach((li) => {
    // Add margin/spacing to manual label span markers (e.g., "a.", "b.", "1.", "•")
    const firstSpan = li.querySelector("span:first-child");
    if (firstSpan) {
      const text = firstSpan.textContent.trim();
      if (text && text.length <= 4 && /^[a-zA-Z0-9•\-\u2022\u25E6\u25AA\u2013\u2014]+[\.]?$/.test(text)) {
        const existingStyle = firstSpan.getAttribute("style") || "";
        if (!existingStyle.includes("margin-right") && !existingStyle.includes("padding-right")) {
          firstSpan.setAttribute(
            "style",
            mergeStyles(existingStyle, "margin-right:8px;display:inline-block;")
          );
        }
      }
    }

    // Ensure list items wrap correctly on mobile
    const existingStyle = li.getAttribute("style") || "";
    let newStyle = existingStyle;
    if (!existingStyle.includes("width")) {
      newStyle = mergeStyles(newStyle, "width:auto;");
    }
    if (!existingStyle.includes("max-width")) {
      newStyle = mergeStyles(newStyle, "max-width:100%;");
    }
    if (!existingStyle.includes("word-break")) {
      newStyle = mergeStyles(newStyle, "word-break:normal;");
    }
    if (!existingStyle.includes("overflow-wrap")) {
      newStyle = mergeStyles(newStyle, "overflow-wrap:break-word;");
    }
    li.setAttribute("style", newStyle);
  });

  // ── 7. Ensure standard layout constraints on paragraphs, divs, spans ─────
  doc.querySelectorAll("p, div, span").forEach((el) => {
    // Skip list item marker spans
    if (el.tagName === "SPAN" && el.parentElement?.tagName === "LI" && el === el.parentElement.querySelector("span:first-child")) {
      return;
    }
    const existingStyle = el.getAttribute("style") || "";
    let newStyle = existingStyle;
    if (!existingStyle.includes("width")) {
      newStyle = mergeStyles(newStyle, "width:auto;");
    }
    if (!existingStyle.includes("max-width")) {
      newStyle = mergeStyles(newStyle, "max-width:100%;");
    }
    if (!existingStyle.includes("word-break")) {
      newStyle = mergeStyles(newStyle, "word-break:normal;");
    }
    if (!existingStyle.includes("overflow-wrap")) {
      newStyle = mergeStyles(newStyle, "overflow-wrap:break-word;");
    }
    if (newStyle !== existingStyle) {
      el.setAttribute("style", newStyle);
    }
  });

  // ── 8. Return the normalized body HTML ───────────────────────────────────
  return doc.body.innerHTML;
}
