import { range } from '../util/range.js';

export class HexGlyph {
  constructor(private readonly buffer: Uint16Array) {}

  static parse(s: string): HexGlyph {
    const numbers = range(16).map((i) =>
      Number('0x' + s.slice(4 * i, 4 * i + 4)),
    );
    const buffer = Uint16Array.of(...numbers);
    return new HexGlyph(buffer);
  }

  shouldPaint(x: number, y: number): boolean {
    return (this.buffer[y] & (1 << (15 - x))) !== 0;
  }

  paint(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    scale: number = 1,
  ) {
    for (const sx of range(16)) {
      for (const sy of range(16)) {
        if (this.shouldPaint(sx, sy)) {
          ctx.fillRect(x + scale * sx, y + scale * sy, scale, scale);
        }
      }
    }
  }
}
