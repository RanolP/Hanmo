export const 초성List = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
export const 중성List = 'ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ';
export const 종성List =
  ' ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅅㅆㅇㅈㅊㅋㅌㅍㅎ';

export const codepoint가 = '가'.codePointAt(0)!;
export const codepoint힣 = '힣'.codePointAt(0)!;

export function decomposeHangul(char: string): [string, string, string] {
  const index = char.codePointAt(0)! - codepoint가;
  const 초성 = Math.floor(index / 종성List.length / 중성List.length);
  const 중성 = Math.floor((index / 종성List.length) % 중성List.length);
  const 종성 = Math.floor(index % 종성List.length);

  return [초성List[초성], 중성List[중성], 종성List[종성]];
}

export function composeHangul(
  초성: string,
  중성: string,
  종성: string,
): string {
  return String.fromCodePoint(
    codepoint가 +
      초성List.indexOf(초성) * 중성List.length * 종성List.length +
      중성List.indexOf(중성) * 종성List.length +
      종성List.indexOf(종성),
  );
}

export function isHangul(char: string): boolean {
  const codepoint = char.codePointAt(0)!;
  return codepoint가 <= codepoint && codepoint <= codepoint힣;
}

export function* makeHangulCombination(
  초성List: string,
  중성List: string,
  종성List: string,
): Generator<string> {
  for (const 초성 of 초성List) {
    for (const 중성 of 중성List) {
      for (const 종성 of 종성List) {
        yield composeHangul(초성, 중성, 종성);
      }
    }
  }
}

globalThis.Hangul = {
  초성List,
  중성List,
  종성List,
  decomposeHangul,
  composeHangul,
  isHangul,
  makeHangulCombination,
};
