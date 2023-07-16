import { isHangul } from './hangul.mjs';

export const SupportStatus = Object.freeze({
  Unsupported: 'UNSUPPORTED',
  PartiallySupported: 'PARTIALLY_SUPPORTED',
  FullySupported: 'FULLY_SUPPORTED',
});

export function evaluateSupportStatus(font, text) {
  const onlyHangul = Array.from(text).filter((ch) => isHangul(ch));
  const onlySupportedHangul = onlyHangul.filter((ch) => ch in font);

  if (onlySupportedHangul.length === 0) {
    return { kind: SupportStatus.Unsupported };
  } else if (onlySupportedHangul.length < onlyHangul.length) {
    return {
      kind: SupportStatus.PartiallySupported,
      coverage: onlySupportedHangul.length / onlyHangul.length,
    };
  } else {
    return { kind: SupportStatus.FullySupported };
  }
}

export function diffSupportStatus(old, now, text) {
  const oldStatus = evaluateSupportStatus(old, text);
  const nowStatus = evaluateSupportStatus(now, text);

  if (
    oldStatus.kind === nowStatus.kind &&
    (oldStatus.kind !== SupportStatus.PartiallySupported ||
      oldStatus.coverage === nowStatus.coverage)
  ) {
    return { changed: false, now: nowStatus };
  } else {
    return { changed: true, old: oldStatus, now: nowStatus };
  }
}
