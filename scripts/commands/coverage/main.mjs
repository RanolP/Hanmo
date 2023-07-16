import { DiffType, diffFont, parseFont } from '../../utils/hexfont.mjs';
import { parseMinecraftCorpus } from '../../utils/corpus.mjs';
import {
  SupportStatus,
  diffSupportStatus,
} from '../../utils/support-checker.mjs';
import { FrequencyCollector } from '../../utils/frequency.mjs';
import { renderHangulSyllableSection } from './components/hangul-syllable.mjs';

const fontOld = await parseFont('./.previous/dist/out-complete-only.hex');
const fontNow = await parseFont('./dist/out-complete-only.hex');
const fontDiff = diffFont(fontOld, fontNow);
const corpus = await parseMinecraftCorpus('./.hanmo/ko_KR.json');

const frequencyCollector = new FrequencyCollector();
const nowStatuses = {
  [SupportStatus.Unsupported]: [],
  [SupportStatus.PartiallySupported]: [],
  [SupportStatus.FullySupported]: [],
};
const transitions = {
  [SupportStatus.Unsupported]: {
    [SupportStatus.PartiallySupported]: [],
    [SupportStatus.FullySupported]: [],
  },
  [SupportStatus.PartiallySupported]: {
    [SupportStatus.Unsupported]: [],
    [SupportStatus.PartiallySupported]: [],
    [SupportStatus.FullySupported]: [],
  },
  [SupportStatus.FullySupported]: {
    [SupportStatus.Unsupported]: [],
    [SupportStatus.PartiallySupported]: [],
  },
};
for (const [key, text] of corpus) {
  frequencyCollector.collect(text);
  const diff = diffSupportStatus(fontOld, fontNow, text);
  nowStatuses[diff.now.kind].push(text);
  if (!diff.changed) {
    continue;
  }
  if (diff.old.kind !== diff.now.kind) {
    transitions[diff.now.kind][diff.old.kind].push({ text });
  } else {
    transitions[diff.now.kind][diff.old.kind].push({
      text,
      coverageMod: diff.now.coverage - diff.old.coverage,
    });
  }
}

const ctx = {
  fontNow,
  fontDiff,
};

console.log(
  `
## Hanmo Coverage Report

${renderHangulSyllableSection(ctx)}

### Minecraft (${percent(
    nowStatuses[SupportStatus.FullySupported].length,
    corpus.length,
  )})

🟢 \`  SUPPORTED\` ${nowStatuses[SupportStatus.FullySupported].length} of ${
    corpus.length
  }
🟡 \`    PARTIAL\` ${nowStatuses[SupportStatus.PartiallySupported].length} of ${
    corpus.length
  }
🔴 \`UNSUPPORTED\` ${nowStatuses[SupportStatus.Unsupported].length} of ${
    corpus.length
  }

#### Frequently Appeared Unsupported Characters

${frequencyCollector.ranking
  .filter(([ch, _]) => !(ch in fontNow))
  .slice(0, 20)
  .map(([k, v]) => `${k} (${v})`)
  .join(', ')}

#### Supported List

<details>
<summary>See All</summary>

[${Array.from(new Set(nowStatuses[SupportStatus.FullySupported]))
    .map((s) => JSON.stringify(s))
    .sort()
    .join(', ')}]

</details>

`.trim(),
);

function percent(value, total) {
  return ((100 * value) / total).toFixed(2) + '%';
}
