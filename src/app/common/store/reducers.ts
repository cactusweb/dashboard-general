import { ActionReducerMap } from '@ngrx/store';
import { State } from './state';
import { authRedusers } from './auth/auth.redusers';
import { userRedusers } from './user/user.reducers';
import { licensesRedusers } from './licenses/licenses.reducers';

export const reducers: ActionReducerMap<State, any> = {
  auth: authRedusers,
  user: userRedusers,
  licenses: licensesRedusers,
};
