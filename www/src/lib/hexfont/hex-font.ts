import { HexGlyph } from './hex-glyph.js';

export class HexFont {
  constructor(private readonly map: Map<number, HexGlyph>) {}

  static parse(input: string) {
    const map = new Map();
    input
      .trim()
      .split('\n')
      .forEach((s) => {
        const [key, value] = s.split(':');
        const ch = Number('0x' + key);
        const glyph = HexGlyph.parse(value);
        map.set(ch, glyph);
      });
    return new HexFont(map);
  }

  get(ch: number): HexGlyph | undefined {
    return this.map.get(ch);
  }
}
