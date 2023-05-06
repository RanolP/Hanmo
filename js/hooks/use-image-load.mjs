/**
 *
 * @param {HTMLImageElement} $el
 * @param {() => void} callback
 * @returns {() => void}
 */
export function useImageLoad($el, callback) {
  if ($el.complete) {
    callback();
  } else {
    $el.addEventListener('load', callback);
    return () => $el.removeEventListener('load', callback);
  }
}
