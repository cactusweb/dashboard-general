import { State } from '@csd-store/state';
import { createSelector } from '@ngrx/store';

export interface AuthState {
  data: {
    authToken: string;
  } | null;
  pending: boolean;
}

export const initialAuthState: AuthState = {
  data: null,
  pending: false,
};

const authState = (state: State) => state.auth;

export const selectIsAuthed = createSelector(
  authState,
  (state) => !!state.data?.authToken
);

export const selectAuthToken = createSelector(
  authState,
  (state) => state.data?.authToken
);

export const selectAuthIsPending = createSelector(
  authState,
  (state) => state.pending
);
