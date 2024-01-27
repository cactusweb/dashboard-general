import { AuthActions, AuthActionsType } from './auth.actions';
import { AuthState, initialAuthState } from './auth.selectors';

export const authRedusers = (
  state = initialAuthState,
  action: AuthActionsType
): AuthState => {
  switch (action.type) {
    case AuthActions.Auth:
      return {
        data: null,
      };
    case AuthActions.AuthSuccess:
      return {
        data: {
          authToken: action.authToken,
        },
      };
    case AuthActions.AuthLogout:
    case AuthActions.SetAuthInitialState:
      return initialAuthState;
    default:
      return state;
  }
};
