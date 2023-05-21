import { nanoquery } from '@nanostores/query';
import { computed } from 'nanostores';
import { HexFont } from '../../hexfont/hex-font.js';
import { createFetcherStore, fetcher } from './context.js';

const store = createFetcherStore<string>(['dist/out.hex'], {
  fetcher: (...keys) => fetcher(...keys).then((r) => r.text()),
});

export const fontAtom = computed(store, ({ data, ...value }) => ({
  ...value,
  data: data !== undefined ? HexFont.parse(data) : undefined,
}));

export function reloadFont() {
  store.invalidate();
}
