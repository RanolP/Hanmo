/**
 *
 * @param {number} max
 * @return {number[]}
 */
export function range(max) {
  return Array.from({ length: max }).map((_, i) => i);
}

/**
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns number
 */
export function coerceIn(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 *
 * @param {unknown} a
 * @param {unknown} b
 * @returns boolean
 */
export function shallowCompare(a, b) {
  if (typeof a !== typeof b) {
    return false;
  } else if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return range(a.length).every((i) => a[i] === b[i]);
  } else if (typeof a === 'object' && typeof b === 'object') {
    return [...Object.keys(a), ...Object.keys(b)].every(
      (key) => a[key] === b[key],
    );
  } else {
    return a === b;
  }
}
