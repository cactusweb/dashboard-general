import { UserDTO } from '@csd-models/user.models';
import { State } from '@csd-store/state';
import { createSelector } from '@ngrx/store';

export interface UserState {
  data: null | UserDTO;
  pending: boolean;
}

export const initialUserState: UserState = {
  data: null,
  pending: false,
};

const userState = (state: State) => state.user;

export const selectUserPending = createSelector(
  userState,
  (state) => state.pending
);

export const selectUser = createSelector(userState, (state) => state.data);
