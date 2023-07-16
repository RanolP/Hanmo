const 가codepoint = '가'.codePointAt(0);
const 힣codepoint = '힣'.codePointAt(0);

export const hangulTotal = 힣codepoint - 가codepoint;

export function isHangul(ch) {
  const codepoint = ch.codePointAt(0);
  return 가codepoint <= codepoint && codepoint <= 힣codepoint;
}
