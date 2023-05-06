import { codepoint가, codepoint힣 } from '../../lib/hangul.mjs';
import { StateReducer } from '../../lib/state-reducer.mjs';
import { coerceIn } from '../../lib/utils.mjs';
import { pageStorage } from '../../storages/page.mjs';

const pageRange = [0, Math.ceil((codepoint힣 - codepoint가) / 256) - 1];

/**
 * @type {StateReducer<number, { type: 'PREV_PAGE' } | { type: 'NEXT_PAGE' }>}
 */
export const pageReducer = new StateReducer(
  pageStorage.load(),
  (old, command) => {
    switch (command.type) {
      case 'PREV_PAGE': {
        return coerceIn(old - 1, ...pageRange);
      }
      case 'NEXT_PAGE': {
        return coerceIn(old + 1, ...pageRange);
      }
      default: {
        throw new Error('unknown command:', command);
      }
    }
  },
);

pageReducer.subscribe((newState) => {
  pageStorage.save(newState);
});

export function prevPage() {
  pageReducer.dispatch({ type: 'PREV_PAGE' });
}

export function nextPage() {
  pageReducer.dispatch({ type: 'NEXT_PAGE' });
}
