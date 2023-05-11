/**
 *
 * @template T
 */
export class TypedStorage {
  /**
   *
   * @param {{
   *   key: string,
   *   stringify: (value: T) => string,
   *   parse: (s: string | undefined | null) => T | null
   * }} options
   */
  constructor({ key, stringify, parse }) {
    this.key = key;
    this.stringify = stringify;
    this.parse = parse;
  }
  /**
   *
   * @param {T} value
   */
  save(value) {
    localStorage.setItem(this.key, this.stringify(value));
  }
  reset() {
    localStorage.removeItem(this.key);
  }
  /**
   *
   * @returns {T}
   */
  load() {
    const value = localStorage.getItem(this.key);
    return this.parse(value);
  }
}
