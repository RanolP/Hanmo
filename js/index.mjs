import { $canvas, $download, $h1, $img, $reload } from './elements.mjs';
import { useImageLoad } from './hooks/use-image-load.mjs';
import { useKeyPress } from './hooks/use-key-press.mjs';
import { derivedState } from './lib/derived-state.mjs';
import { downloadFile } from './lib/download-file.mjs';
import { codepoint가, codepoint힣, isHangul } from './lib/hangul.mjs';
import { coerceIn } from './lib/utils.mjs';
import { eraseGuide, renderMatrix } from './ui/render-matrix.mjs';
import { nextPage, pageReducer, prevPage } from './ui/state/page.mjs';
import {
  endReload,
  reloadReducer,
  startReload,
} from './ui/state/reload-button.mjs';

const canvasCtx = $canvas.getContext('2d');

const beginReducer = derivedState(pageReducer, (page) => page * 256);

$download.onclick = function download() {
  eraseGuide(canvasCtx);
  downloadFile(
    $canvas.toDataURL('image/png'),
    `unicode_page_${((codepoint가 + beginReducer.read()) / 0x100)
      .toString(16)
      .toLowerCase()}.png`,
  );
};

function redraw(begin = beginReducer.read()) {
  renderMatrix($img, canvasCtx, begin);
}

beginReducer.subscribe((begin) => redraw(begin));
beginReducer.subscribe((begin) => {
  const beginChar = String.fromCodePoint(
    coerceIn(codepoint가 + begin, codepoint가, codepoint힣),
  );
  const endChar = String.fromCodePoint(
    coerceIn(codepoint가 + begin + 256 - 1, codepoint가, codepoint힣),
  );
  $h1.innerText = `현재 페이지 : ${(codepoint가 + begin)
    .toString(16)
    .toUpperCase()} (${beginChar} ~ ${endChar})`;
});

$reload.onclick = startReload;
reloadReducer.subscribe((isReloading) => {
  if (!isReloading) {
    return;
  }
  const nextUrl = new URL($img.src);
  nextUrl.searchParams.set('t', +new Date());
  $img.src = nextUrl;
  fetch($img.src, { cache: 'reload', mode: 'no-cors' }).finally(() => {
    endReload();
  });
});
reloadReducer.subscribe((isReloading) => {
  if (isReloading) {
    $reload.disabled = true;
    $reload.innerHTML = '이미지 가져오는 중...';
  } else {
    $reload.disabled = false;
    $reload.innerHTML = '새로고침';
  }
});
reloadReducer.subscribe((isReloading) => {
  if (!isReloading) {
    redraw();
  }
});

useKeyPress(['ArrowLeft', 'a'], () => prevPage());
useKeyPress(['ArrowRight', 'd'], () => nextPage());
useKeyPress('r', () => reloadImage());
useImageLoad($img, () => redraw());
