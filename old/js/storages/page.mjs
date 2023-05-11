import { TypedStorage } from '../lib/typed-storage.mjs';

/**
 * @type {TypedStorage<number>}
 */
export const pageStorage = new TypedStorage({
  key: 'page',
  stringify: (n) => n.toString(),
  parse: (s) => {
    const parsed = Number(s);
    if (Number.isNaN(parsed)) {
      return 0;
    } else {
      return parsed;
    }
  },
});
