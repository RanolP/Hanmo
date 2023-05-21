import { atom, computed } from 'nanostores';
import { FONT_SIZE } from './constants.js';

const canvas = document.getElementById('playground-view') as HTMLCanvasElement;

export const canvasWidthAtom = atom(FONT_SIZE + 1);
export const canvasHeightAtom = atom(FONT_SIZE + 1);

export const ctxAtom = computed(
  [canvasWidthAtom, canvasHeightAtom],
  () => canvas.getContext('2d')!,
);

export const canvasGlyphPerRowAtom = computed(canvasWidthAtom, (value) =>
  Math.floor(value / (FONT_SIZE + 1)),
);

canvasWidthAtom.subscribe((width) => {
  canvas.width = width;
});
canvasHeightAtom.subscribe((height) => {
  canvas.height = height;
  canvas.style.height = `${height}px`;
});

const resizeObserver = new ResizeObserver(([canvasEntry]) => {
  canvasWidthAtom.set(canvasEntry.contentRect.width);
});
resizeObserver.observe(canvas);
