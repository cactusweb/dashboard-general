import { ActionReducerMap } from '@ngrx/store';
import { State } from './state';
import { authRedusers } from './auth/auth.redusers';

export const reducers: ActionReducerMap<State, any> = {
  auth: authRedusers,
};
