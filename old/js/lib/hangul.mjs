export const 초성List = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
export const 중성List = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
export const 종성List =
  ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅅㅆㅇㅈㅊㅋㅌㅍㅎ';

export const codepoint가 = '가'.codePointAt(0);
export const codepoint힣 = '힣'.codePointAt(0);

/**
 *
 * @param {string} char
 * @returns {[string, string, string]}
 */
export function decomposeHangul(char) {
  const index = char.codePointAt(0) - codepoint가;
  const 초성 = Math.floor(index / 종성List.length / 중성List.length);
  const 중성 = Math.floor((index / 종성List.length) % 중성List.length);
  const 종성 = Math.floor(index % 종성List.length);

  return [초성List[초성], 중성List[중성], 종성List[종성]];
}

/**
 *
 * @param {string} char
 * @returns {boolean}
 */
export function isHangul(char) {
  const codepoint = char.codePointAt(0);
  return codepoint가 <= codepoint && codepoint <= codepoint힣;
}
