import {
  chooseFinal,
  chooseInitial,
  chooseMedium,
} from '../lib/dokkaebi-hangul.mjs';
import { decomposeHangul } from '../lib/hangul.mjs';

/**
 *
 * @param {string} char
 * @param {HTMLImageElement} $spriteSheet
 * @param {CanvasRenderingContext2D} canvasCtx
 * @param {number} canvasX
 * @param {number} canvasY
 */
export function renderGlyph($spriteSheet, canvasCtx, char, canvasX, canvasY) {
  const [초성, 중성, 종성] = decomposeHangul(char);
  for (const [spriteX, spriteY] of [
    chooseInitial(초성, 중성, 종성),
    chooseMedium(초성, 중성, 종성),
    chooseFinal(초성, 중성, 종성),
  ].filter(Boolean)) {
    canvasCtx.drawImage(
      $spriteSheet,
      16 * spriteX,
      16 * spriteY,
      16,
      16,
      16 * canvasX,
      16 * canvasY,
      16,
      16,
    );
  }
}
