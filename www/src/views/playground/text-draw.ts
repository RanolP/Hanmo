import { computed, onSet } from 'nanostores';
import { canvasGlyphPerRowAtom, canvasHeightAtom, ctxAtom } from './canvas.js';
import { inputTextAtom } from './input.js';
import { BORDER_WIDTH, FONT_SIZE, MULTIPLIER } from './constants.js';
import { range } from '../../lib/util/range.js';
import { fontAtom } from '../../lib/hanmo-preview/data-sources/hex-font.js';

const rowCountAtom = computed(
  [canvasGlyphPerRowAtom, inputTextAtom],
  (canvasGlyphPerRow, inputText) =>
    inputText.length === 0 || canvasGlyphPerRow === 0
      ? 1
      : Math.ceil(inputText.length / canvasGlyphPerRow),
);

rowCountAtom.subscribe((rowCount) => {
  canvasHeightAtom.set((FONT_SIZE + BORDER_WIDTH) * rowCount);
});

const dependencies = computed(
  [ctxAtom, fontAtom, canvasGlyphPerRowAtom, inputTextAtom, rowCountAtom],
  (...values) => values,
);

dependencies.subscribe(
  ([ctx, { data: font }, canvasGlyphPerRow, inputText, rowCount]) => {
    for (const y of range(rowCount)) {
      for (const x of range(canvasGlyphPerRow)) {
        ctx.clearRect(
          (FONT_SIZE + BORDER_WIDTH) * x,
          (FONT_SIZE + BORDER_WIDTH) * y,
          FONT_SIZE,
          FONT_SIZE,
        );
        if (x % 2 !== y % 2) {
          ctx.fillStyle = '#a2a2d2';
        } else {
          ctx.fillStyle = '#b2b2b2';
        }
        ctx.fillRect(
          (FONT_SIZE + BORDER_WIDTH) * x,
          (FONT_SIZE + BORDER_WIDTH) * y,
          FONT_SIZE,
          FONT_SIZE,
        );
        const idx = x + y * canvasGlyphPerRow;
        if (idx < inputText.length && font) {
          const ch = inputText.codePointAt(idx)!;
          const glyph = font.get(ch);
          if (glyph) {
            ctx.fillStyle = 'black';
            glyph.paint(
              ctx,
              (FONT_SIZE + BORDER_WIDTH) * x,
              (FONT_SIZE + BORDER_WIDTH) * y,
              MULTIPLIER,
            );
          }
        }
        ctx.fillStyle = 'red';
        ctx.fillRect(
          (FONT_SIZE + BORDER_WIDTH) * (x + 1) - BORDER_WIDTH,
          (FONT_SIZE + BORDER_WIDTH) * y - BORDER_WIDTH,
          BORDER_WIDTH,
          FONT_SIZE + BORDER_WIDTH,
        );
        ctx.fillRect(
          (FONT_SIZE + BORDER_WIDTH) * x - BORDER_WIDTH,
          (FONT_SIZE + BORDER_WIDTH) * (y + 1) - BORDER_WIDTH,
          FONT_SIZE + BORDER_WIDTH,
          BORDER_WIDTH,
        );
      }
    }
  },
);
