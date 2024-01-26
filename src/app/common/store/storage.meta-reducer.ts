// @ts-nocheck
import { ActionReducer, Action } from '@ngrx/store';
import { State } from './state';
import { STATE_KEYS } from './storage-keys';

const setSavedState = (state: State, localStorageKey: string) => {
  localStorage.setItem(localStorageKey, JSON.stringify(state));
};

const getSavedState = (localStorageKey: string): any =>
  JSON.parse(localStorage.getItem(localStorageKey) || '{}');

// the keys from state which we'd like to save.
const stateKeys = STATE_KEYS;
// the key for the local storage.
const localStoreKey = 'app_storage';

// Альтернатива функции pick lodash-es библиотеки
function pick(obj: Object, keys: string[]): any {
  return Object.assign(
    {},
    ...Object.keys(obj)
      .filter((key) => keys.some((k) => k === key))
      .map((key) => ({ [key]: obj[key] }))
  );
}

export function storageMetaReducer<S, A extends Action = Action>(
  reducer: ActionReducer<S, A>
) {
  let onInit = true;
  return (state: S, action: A): S => {
    const nextState = reducer(state, action);
    if (onInit) {
      onInit = false;
      const savedState = getSavedState(localStoreKey);
      return Object.assign(nextState, savedState);
    }

    const stateToSave = pick(nextState, stateKeys);
    setSavedState(stateToSave, localStoreKey);
    return nextState;
  };
}
