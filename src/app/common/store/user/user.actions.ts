import { UserDTO } from '@csd-models/user.models';
import { Action } from '@ngrx/store';

export enum UserActions {
  GetUser = '[User] GetUser',
  GetUserSuccess = '[User] GetUserSuccess',
  GetUserFailed = '[User] GetUserFailed',
  SetUserInitialState = '[User] SetUserInitialState',
}

export class GetUser implements Action {
  readonly type = UserActions.GetUser;
}

export class GetUserSuccess implements Action {
  readonly type = UserActions.GetUserSuccess;
  constructor(public user: UserDTO) {}
}

export class GetUserFailed implements Action {
  readonly type = UserActions.GetUserFailed;
}

export class SetUserInitialState implements Action {
  readonly type = UserActions.SetUserInitialState;
}

export type UserActionsTypes =
  | GetUser
  | GetUserSuccess
  | GetUserFailed
  | SetUserInitialState;
