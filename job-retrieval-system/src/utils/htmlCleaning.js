
function stripHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return doc.body.textContent || "";
}
function decodeHtmlEntities(text) {
  if (!text) return "";
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(text);
  return textarea.value;
}
export function cleanText(text) {
  if (!text) return "";

  let cleaned = decodeHtmlEntities(stripHtml(String(text)));

  cleaned = cleaned
    .replace(/\uFFFD/g, "")
    .replace(/â/g, "'")
    .replace(/â/g, "'")
    .replace(/â/g, '"')
    .replace(/â/g, '"')
    .replace(/â/g, "-")
    .replace(/â/g, "-")
    .replace(/&nbsp;/g, " ")
    .replace(/\*\*/g, "")
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
    .replace(/<\/br>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned;
}
