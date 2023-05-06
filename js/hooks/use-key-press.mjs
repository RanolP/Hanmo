/**
 *
 * @param {string | string[] | (e: KeyboardEvent) => void} predicate
 * @param {*} callback
 * @returns
 */
export function useKeyPress(predicate, callback) {
  if (typeof predicate === 'string') {
    return useKeyPress([predicate], callback);
  } else if (Array.isArray(predicate)) {
    return useKeyPress(({ key }) => predicate.includes(key), callback);
  }

  /**
   *
   * @param {KeyboardEvent} event
   */
  const predicatedCallback = (event) => {
    if (predicate(event)) {
      callback();
    }
  };

  window.addEventListener('keydown', predicatedCallback);

  return () => window.removeEventListener('keydown', predicatedCallback);
}
