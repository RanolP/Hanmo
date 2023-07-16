import { promises as fs } from 'node:fs';
import { mergeKeys } from './set.mjs';

export async function parseFont(path) {
  const fontSrc = await fs.readFile(path, { encoding: 'ascii' });
  const font = Object.fromEntries(
    fontSrc
      .trim()
      .split('\n')
      .map((x) => {
        const [key, value] = x.split(':');
        return [String.fromCodePoint(Number('0x' + key)), value];
      }),
  );
  return font;
}

export const DiffType = Object.freeze({
  Added: 'ADDED',
  Changed: 'CHANGED',
  Deleted: 'DELETED',
  Unchanged: 'UNCHANGED',
});

export function diffFont(old, now) {
  const result = {
    [DiffType.Added]: [],
    [DiffType.Changed]: [],
    [DiffType.Deleted]: [],
  };
  for (const ch of mergeKeys([old, now])) {
    const diffType = diffFontCharacter(old, now, ch);
    if (diffType === DiffType.Unchanged) {
      continue;
    }
    result[diffType].push(ch);
  }
  return result;
}

export function diffFontCharacter(old, now, ch) {
  const oldHas = ch in old;
  const nowHas = ch in now;
  if (oldHas && !nowHas) {
    return DiffType.Deleted;
  } else if (!oldHas && nowHas) {
    return DiffType.Added;
  } else if (old[ch] !== now[ch]) {
    return DiffType.Changed;
  }
  return DiffType.Unchanged;
}
