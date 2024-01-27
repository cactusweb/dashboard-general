import { ActionReducer, Action } from '@ngrx/store';
import { State } from './state';
import { STATE_KEYS } from './storage-keys';

const stateKeys = STATE_KEYS;
const localStorage_key = 'app_storage';

const setSavedState = (state: State) => {
  localStorage.setItem(localStorage_key, JSON.stringify(state));
};

const getSavedState = (): any =>
  JSON.parse(localStorage.getItem(localStorage_key) || '{}');

// Альтернатива функции pick lodash-es библиотеки
function pick(obj: any, keys: string[]): any {
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

  return function (state: S, action: A): S {
    const nextState = reducer(state, action);
    const savedState = getSavedState();

    if (onInit) {
      onInit = false;
      return Object.assign(nextState as any, savedState);
    }

    const stateToSave = pick(nextState, stateKeys);
    setSavedState(stateToSave);
    return nextState;
  };
}
