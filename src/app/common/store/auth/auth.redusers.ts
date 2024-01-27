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
        pending: true,
      };
    case AuthActions.AuthSuccess:
      return {
        data: {
          authToken: action.authToken,
        },
        pending: false,
      };
    case AuthActions.AuthLogout:
      return {
        data: null,
        pending: false,
      };
    case AuthActions.SetAuthInitialState:
      return initialAuthState;
  }
};
