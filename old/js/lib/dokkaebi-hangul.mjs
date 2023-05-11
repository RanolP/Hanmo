/**
 * Logic Reference: https://mytears.org/resources/doc/Hangul/HANGUL.TXT
 */

import { 종성List, 중성List, 초성List } from './hangul.mjs';

/**
 * @param {string} 초성
 * @param {string} 중성
 * @param {string} 종성
 * @returns {[string, string, string]}
 */
export function chooseInitial(초성, 중성, 종성) {
  const 초성xPosition = 초성List.indexOf(초성);
  const baseSpriteY = 2;
  if (종성 === ' ') {
    if ('ㅏㅐㅑㅒㅓㅔㅕㅖㅣ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 0];
    } else if ('ㅗㅛㅡ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 1];
    } else if ('ㅜㅠ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 2];
    } else if ('ㅘㅙㅚㅢ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 3];
    } /* ㅝㅞㅟ */ else {
      return [초성xPosition, baseSpriteY + 4];
    }
  } else {
    if ('ㅏㅐㅑㅒㅓㅔㅕㅖㅣ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 5];
    } else if ('ㅗㅛ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 6];
    } else if ('ㅜㅠㅡ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 7];
    } else if ('ㅘㅙㅚ'.includes(중성)) {
      return [초성xPosition, baseSpriteY + 8];
    } /* ㅝㅞㅟㅢ */ else {
      return [초성xPosition, baseSpriteY + 9];
    }
  }
}

/**
 * @param {string} 초성
 * @param {string} 중성
 * @param {string} 종성
 * @returns {[string, string, string]}
 */
export function chooseMedium(초성, 중성, 종성) {
  const 중성xPosition = 중성List.indexOf(중성);
  const baseSpriteY = 12;
  if (종성 === ' ') {
    if ('ㄱㄲㅋ'.includes(초성)) {
      return [중성xPosition, baseSpriteY + 0];
    } else {
      return [중성xPosition, baseSpriteY + 1];
    }
  } else {
    if ('ㄱㄲㅋ'.includes(초성)) {
      return [중성xPosition, baseSpriteY + 2];
    } else {
      return [중성xPosition, baseSpriteY + 3];
    }
  }
}

/**
 * @param {string} 초성
 * @param {string} 중성
 * @param {string} 종성
 * @returns {[string, string, string] | null}
 */
export function chooseFinal(초성, 중성, 종성) {
  if ('종성' === ' ') {
    return null;
  }
  const 종성xPosition = 종성List.indexOf(종성) - 1;
  const baseSpriteY = 16;
  if ('ㅏㅑㅘ'.includes(중성)) {
    return [종성xPosition, baseSpriteY + 0];
  } else if ('ㅓㅕㅚㅝㅟㅢㅣ'.includes(중성)) {
    return [종성xPosition, baseSpriteY + 1];
  } else if ('ㅐㅒㅔㅖㅙㅞ'.includes(중성)) {
    return [종성xPosition, baseSpriteY + 2];
  } /* ㅗㅛㅜㅠㅡ */ else {
    return [종성xPosition, baseSpriteY + 3];
  }
}
