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

const textSupported = [];
const textPartiallySupported = [];
const textUnsupported = [];
const frequencyMap = {};
for (const [key, text] of texts) {
  let previousSupported = font.has(text[0]);
  let partialSupport = false;
  for (const ch of text) {
    if (
      ch.codePointAt(0) < '가'.codePointAt(0) ||
      '힣'.codePointAt(0) < ch.codePointAt(0)
    ) {
      continue;
    }
    if (!font.has(ch)) {
      frequencyMap[ch] = (frequencyMap[ch] ?? 0) + 1;
    }
    if (partialSupport) {
      continue;
    }
    const currentSupported = font.has(ch);
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
