import { State } from '@csd-store/state';
import { createSelector } from '@ngrx/store';

export interface AuthState {
  data: {
    authToken: string;
  } | null;
}

export const initialAuthState: AuthState = {
  data: null,
};

const authState = (state: State) => state.auth;

export const selectAuthState = createSelector(authState, (state) => state);

export const selectIsAuthed = createSelector(
  authState,
  (state) => !!state.data?.authToken
);

export const selectAuthToken = createSelector(
  authState,
  (state) => state.data?.authToken
);
