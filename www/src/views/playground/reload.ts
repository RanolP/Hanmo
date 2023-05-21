import { reloadFont } from '../../lib/hanmo-preview/data-sources/hex-font.js';

const reload = document.getElementById(
  'playground-reload',
) as HTMLButtonElement;

reload.addEventListener('click', () => {
  reloadFont();
});
