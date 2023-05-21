export const MULTIPLIER = 8;
export const FONT_SIZE = 16 * MULTIPLIER;

export const BORDER_WIDTH = 2;

document.documentElement.style.setProperty(
  '--playground-grid-font-size',
  `${FONT_SIZE}px`,
);
document.documentElement.style.setProperty(
  '--playground-grid-border',
  `${BORDER_WIDTH}px`,
);
