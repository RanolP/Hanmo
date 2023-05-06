/**
 *
 * @param {string} href
 * @param {string} filename
 */
export function downloadFile(href, filename) {
  const aTag = document.createElement('a');
  aTag.href = href;
  aTag.download = filename;
  aTag.click();
}
