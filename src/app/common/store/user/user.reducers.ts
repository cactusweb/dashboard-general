import { UserActions, UserActionsTypes } from './user.actions';
import { UserState, initialUserState } from './user.selectors';

export const userRedusers = (
  state = initialUserState,
  action: UserActionsTypes
): UserState => {
  switch (action.type) {
    case UserActions.GetUser:
      return {
        ...state,
        pending: true,
      };
    case UserActions.GetUserFailed:
      return {
        ...state,
        pending: false,
      };
    case UserActions.GetUserSuccess:
      return {
        data: action.user,
        pending: false,
      };
    case UserActions.SetUserInitialState:
      return initialUserState;
    default:
      return state;
  }
};
