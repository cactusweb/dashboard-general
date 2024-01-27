import { Action } from '@ngrx/store';

export enum AuthActions {
  Auth = '[Auth] Auth',
  AuthSuccess = '[Auth] AuthSuccess',
  AuthLogout = '[Auth] Logout',
  SetAuthInitialState = '[Auth] SetAuthInitialState',
}

export class Auth implements Action {
  readonly type = AuthActions.Auth;
  constructor(public redirectToParam?: Record<string, any>) {}
}

export class AuthSuccess implements Action {
  readonly type = AuthActions.AuthSuccess;
  constructor(public authToken: string) {}
}

export class AuthLogout implements Action {
  readonly type = AuthActions.AuthLogout;
  constructor(public redirectTo?: string) {}
}

export class SetAuthInitialState implements Action {
  readonly type = AuthActions.SetAuthInitialState;
}

export type AuthActionsType =
  | Auth
  | AuthSuccess
  | AuthLogout
  | SetAuthInitialState;
