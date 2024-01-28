import { AuthState, initialAuthState } from './auth/auth.selectors';
import { UserState, initialUserState } from './user/user.selectors';

export interface State {
  auth: AuthState;
  user: UserState;
}

export const initialState: State = {
  auth: initialAuthState,
  user: initialUserState,
};

export function getInitialState(): State {
  return initialState;
}
