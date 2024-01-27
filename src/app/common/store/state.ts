import { AuthState, initialAuthState } from './auth/auth.selectors';

export interface State {
  auth: AuthState;
}

export const initialState: State = {
  auth: initialAuthState,
};

export function getInitialState(): State {
  return initialState;
}
