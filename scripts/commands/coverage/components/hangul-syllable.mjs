import { hangulTotal } from '../../../utils/hangul.mjs';
import { DiffType } from '../../../utils/hexfont.mjs';
import { renderPercent } from '../../../utils/render.mjs';

export function renderHangulSyllableSection({ fontNow, fontDiff }) {
  const charsMade = Object.keys(fontNow).length;
  const supportPercentage = renderPercent(charsMade, hangulTotal);
  const hangulDiff = renderHangulDiff({ fontDiff });

  return `
### Hangull Syllable (${[supportPercentage, hangulDiff]
    .filter(Boolean)
    .join(', ')})

🟢 \`  SUPPORTED\` ${charsMade} of ${hangulTotal}
🔴 \`UNSUPPORTED\` ${hangulTotal - charsMade} of ${hangulTotal}

${renderHangulDiffList({ fontDiff })}
`.trim();
}

function renderHangulDiff({ fontDiff }) {
  const diffs = [
    renderDiff({ icon: '+', color: '66ff66', list: fontDiff[DiffType.Added] }),
    renderDiff({
      icon: '\\ast',
      color: 'ffcc66',
      list: fontDiff[DiffType.Changed],
    }),
    renderDiff({
      icon: '-',
      color: 'ff6666',
      list: fontDiff[DiffType.Deleted],
    }),
  ]
    .filter(Boolean)
    .join(' ');

  return diffs;
}

function renderDiff({ icon, color, list }) {
  if (list.length === 0) {
    return '';
  }
  return `$\\color{${color}}{${icon}\\textrm{${list.length}}}$`;
}

function renderHangulDiffList({ fontDiff }) {
  const diffs = [
    renderDiffList({ label: 'Added', list: fontDiff[DiffType.Added] }),
    renderDiffList({ label: 'Changed', list: fontDiff[DiffType.Changed] }),
    renderDiffList({ label: 'Deleted', list: fontDiff[DiffType.Deleted] }),
  ]
    .filter(Boolean)
    .join('\n\n');

  if (diffs.length > 0) {
    return `
#### Changes

${diffs}
`.trim();
  }

  return '';
}

function renderDiffList({ label, list }) {
  if (list.length === 0) {
    return '';
  }
  return `
<details>
<summary>${label}</summary>
${list.join(', ')}
</details>
`.trim();
}
