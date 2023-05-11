import { codepoint가, isHangul } from '../lib/hangul.mjs';
import { range } from '../lib/utils.mjs';
import { renderGlyph } from './render-glyph.mjs';

function* yieldCanvasPositions() {
  for (const y of range(16)) {
    for (const x of range(16)) {
      yield [x, y, x + y * 16];
    }
  }
}

export function renderMatrix($spriteSheet, canvasCtx, begin) {
  canvasCtx.clearRect(0, 0, 256, 256);
  for (const [canvasX, canvasY, index] of yieldCanvasPositions()) {
    const char = String.fromCodePoint(codepoint가 + begin + index);
    if (!isHangul(char)) {
      break;
    }
    renderGlyph($spriteSheet, canvasCtx, char, canvasX, canvasY);
  }
}

export function eraseGuide(canvasCtx) {
  for (const [canvasX, canvasY] of yieldCanvasPositions()) {
    canvasCtx.clearRect(16 * canvasX, 16 * canvasY, 1, 16);
    canvasCtx.clearRect(16 * canvasX, 16 * canvasY, 16, 1);
    canvasCtx.clearRect(16 * canvasX + 15, 16 * canvasY, 1, 16);
    canvasCtx.clearRect(16 * canvasX, 16 * canvasY + 15, 16, 1);
  }
}
