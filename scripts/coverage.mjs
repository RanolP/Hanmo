import { promises as fs } from 'node:fs';

const fontSrc = await fs.readFile('./dist/out-complete-only.hex', {
  encoding: 'ascii',
});
const font = new Set(
  fontSrc
    .trim()
    .split('\n')
    .map((x) => String.fromCodePoint(Number('0x' + x.split(':')[0]))),
);

const jsonSrc = await fs.readFile('./.hanmo/ko_KR.json', { encoding: 'utf8' });
const texts = Object.entries(JSON.parse(jsonSrc));

let textSupported = [];
let textPartiallySupported = [];
let textUnsupported = [];
textLoop: for (const [key, text] of texts) {
  let previousSupported = font.has(text[0]);
  for (const ch of text) {
    if (
      ' \nabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.includes(ch)
    ) {
      continue;
    }
    const currentSupported = font.has(ch);
    if (previousSupported !== currentSupported) {
      textPartiallySupported.push(text);
      continue textLoop;
    }
    previousSupported = currentSupported;
  }
  if (previousSupported) {
    textSupported.push(text);
  } else {
    textUnsupported.push(text);
  }
}

const charsMade = font.size;
const charsTotal = '힣'.codePointAt(0) - '가'.codePointAt(0);

console.log(
  `
## Hanmo Coverage Report

### Hangul Syllable (${percent(charsMade, charsTotal)})

🟢 \`  SUPPORTED\` ${charsMade} of ${charsTotal}
🔴 \`UNSUPPORTED\` ${charsTotal - charsMade} of ${charsTotal}

### Minecraft (${percent(textSupported.length, texts.length)})

🟢 \`  SUPPORTED\` ${textSupported.length} of ${texts.length}
🟡 \`    PARTIAL\` ${textPartiallySupported.length} of ${texts.length}
🔴 \`UNSUPPORTED\` ${textUnsupported.length} of ${texts.length}

#### Supported List

${Array.from(new Set(textSupported)).sort().join(', ')}

`.trim(),
);

function percent(value, total) {
  return ((100 * value) / total).toFixed(2) + '%';
}
