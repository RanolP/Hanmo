import { isHangul } from './hangul.mjs';

export class FrequencyCollector {
  #map = new Map();

  collect(text) {
    for (const ch of text) {
      if (!isHangul(ch)) {
        continue;
      }
      if (!this.#map.has(ch)) {
        this.#map.set(ch, 0);
      }
      this.#map.set(ch, this.#map.get(ch) + 1);
    }
  }

  get ranking() {
    const entries = Array.from(this.#map.entries());
    entries.sort(([_0, lFreq], [_1, rFreq]) => rFreq - lFreq);
    return entries;
  }
}
