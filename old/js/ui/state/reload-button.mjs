import { StateReducer } from '../../lib/state-reducer.mjs';

/**
 * @type {StateReducer<boolean, { type: 'START' } | { type: 'DONE' } >}
 */
export const reloadReducer = new StateReducer(false, (old, command) => {
  switch (command.type) {
    case 'START': {
      return true;
    }
    case 'DONE': {
      return false;
    }
    default: {
      throw new Error('unknown command:', command);
    }
  }
});

export function startReload() {
  reloadReducer.dispatch({ type: 'START' });
}

export function endReload() {
  reloadReducer.dispatch({ type: 'DONE' });
}
