import merge from 'lodash.merge';
import { ActionReducer, Action } from '@ngrx/store';

const localStorage_key = 'app_storage';

export function storageMetaReducer<S, A extends Action = Action>(
  reducer: ActionReducer<S, A>
) {
  return function (state: S, action: A): S {
    const nextState = reducer(state, action);
    const savedState =
      JSON.parse(localStorage.getItem(localStorage_key)!) || {};
    merge(nextState, savedState);
    localStorage.setItem(localStorage_key, JSON.stringify(nextState));
    return nextState;
  };
}
