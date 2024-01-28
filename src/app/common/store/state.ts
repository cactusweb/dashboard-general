import { AuthState, initialAuthState } from './auth/auth.selectors';
import {
  LicensesState,
  initialLicensesState,
} from './licenses/licenses.selectors';
import { UserState, initialUserState } from './user/user.selectors';

export interface State {
  auth: AuthState;
  user: UserState;
  licenses: LicensesState;
}

export const initialState: State = {
  auth: initialAuthState,
  user: initialUserState,
  licenses: initialLicensesState,
};

export function getInitialState(): State {
  return initialState;
}
