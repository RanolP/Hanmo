import { promises as fs } from 'node:fs';

async function parseFont(path) {
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

const fontOld = await parseFont('./.previous/dist/out-complete-only.hex');
const fontCurrent = await parseFont('./dist/out-complete-only.hex');
const fontDiff = Array.from(
  new Set([...Object.keys(fontOld), ...Object.keys(fontCurrent)]),
).reduce(
  (acc, curr) => {
    if (curr in fontCurrent) {
      if (curr in fontOld) {
        if (fontCurrent[curr] !== fontOld[curr]) {
          acc.changed.push(curr);
        }
      } else {
        acc.added.push(curr);
      }
    } else {
      acc.deleted.push(curr);
    }
    return acc;
  },
  { deleted: [], changed: [], added: [] },
);
const jsonSrc = await fs.readFile('./.hanmo/ko_KR.json', { encoding: 'utf8' });
const texts = Object.entries(JSON.parse(jsonSrc));

const textSupported = [];
const textPartiallySupported = [];
const textUnsupported = [];
const frequencyMap = {};
for (const [key, text] of texts) {
  let previousSupported = text[0] in fontCurrent;
  let partialSupport = false;
  for (const ch of text) {
    if (
      ch.codePointAt(0) < '가'.codePointAt(0) ||
      '힣'.codePointAt(0) < ch.codePointAt(0)
    ) {
      continue;
    }
    if (!(ch in fontCurrent)) {
      frequencyMap[ch] = (frequencyMap[ch] ?? 0) + 1;
    }
    if (partialSupport) {
      continue;
    }
    const currentSupported = ch in fontCurrent;
    if (previousSupported !== currentSupported) {
      textPartiallySupported.push(text);
      partialSupport = true;
    }
    previousSupported = currentSupported;
  }
  if (partialSupport) {
    continue;
  }
  if (previousSupported) {
    textSupported.push(text);
  } else {
    textUnsupported.push(text);
  }
}

const charsMade = Object.keys(fontCurrent).length;
const charsTotal = '힣'.codePointAt(0) - '가'.codePointAt(0);

console.log(
  `
## Hanmo Coverage Report

### Hangul Syllable (${percent(charsMade, charsTotal)}${
    fontDiff.size > 0 ? ', +' + fontDiff.size : ''
  })

🟢 \`  SUPPORTED\` ${charsMade} of ${charsTotal}
🔴 \`UNSUPPORTED\` ${charsTotal - charsMade} of ${charsTotal}

### Minecraft (${percent(textSupported.length, texts.length)})

🟢 \`  SUPPORTED\` ${textSupported.length} of ${texts.length}
🟡 \`    PARTIAL\` ${textPartiallySupported.length} of ${texts.length}
🔴 \`UNSUPPORTED\` ${textUnsupported.length} of ${texts.length}

#### Frequently Appeared Unsupported Characters

${Object.entries(frequencyMap)
  .sort(([_, fl], [__, fr]) => fr - fl)
  .slice(0, 20)
  .map(([k, v]) => `${k} (${v})`)
  .join(', ')}

#### Supported List

${Array.from(new Set(textSupported)).sort().join(', ')}

`.trim(),
);

function percent(value, total) {
  return ((100 * value) / total).toFixed(2) + '%';
}
