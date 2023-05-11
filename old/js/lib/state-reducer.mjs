import { shallowCompare } from './utils.mjs';

/**
 * @template State
 * @template Command
 */
export class StateReducer {
  /**
   * @type {State}
   */
  #state;
  /**
   * @type {(old: State, command: Command) => State}
   */
  #dispatchImpl;
  /**
   * @type {(oldState: State, newState: State) => boolean}
   */
  #comparator;
  /**
   * @type {Set<(newState: State) => void>}
   */
  #subscribeSet = new Set();

  /**
   *
   * @param {State} initialState
   * @param {(old: State, command: Command) => State} dispatch
   * @param {(oldState: State, newState: State) => boolean} comparator
   */
  constructor(initialState, dispatch, comparator = shallowCompare) {
    this.#state = initialState;
    this.#dispatchImpl = dispatch;
    this.#comparator = comparator;
  }

  /**
   *
   * @param {Command} command
   */
  dispatch(command) {
    const oldState = this.#state;
    const newState = this.#dispatchImpl(oldState, command);
    this.#state = newState;
    if (this.#comparator(oldState, newState) === false) {
      for (const subscribed of this.#subscribeSet) {
        subscribed(newState);
      }
    }
  }

  /**
   *
   * @param {(state: State) => void} callback
   * @returns {() => void}
   */
  subscribe(callback) {
    callback(this.#state);
    this.#subscribeSet.add(callback);

    return () => {
      this.#subscribeSet.delete(callback);
    };
  }

  /**
   * @template T
   * @return {State}
   */
  read() {
    return this.#state;
  }
}
