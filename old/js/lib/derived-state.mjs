import { StateReducer } from './state-reducer.mjs';

/**
 *
 * @template T
 * @template U
 * @param {StateReducer<T>} reducer
 * @param {(value: T) => U} derivation
 * @returns {StateReducer<U>}
 */
export function derivedState(reducer, derivation) {
  const derivedReducer = new StateReducer(
    derivation(reducer.read()),
    (_, { value }) => derivation(value),
  );
  reducer.subscribe((value) =>
    derivedReducer.dispatch({ type: 'UPDATE', value }),
  );
  return derivedReducer;
}
