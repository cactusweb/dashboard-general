import { LicenseDTO } from '@csd-models/license.models';
import { Action } from '@ngrx/store';

export const enum LicensesActions {
  GetLicenses = '[Licenses] GetLicenses',
  GetLicensesSuccess = '[Licenses] GetLicensesSuccess',
  GetLicensesFailed = '[Licenses] GetLicensesFailed',
  SetLicenseData = '[Licenses] SetLicenseData',
  DeleteLicense = '[Licenses] DeleteLicense',
  AddLicense = '[Licenses] AddLicense',
  SetLicensesInitialState = '[Licenses] SetLicensesInitialState',
}

export class GetLicenses implements Action {
  readonly type = LicensesActions.GetLicenses;
}
export class GetLicensesSuccess implements Action {
  readonly type = LicensesActions.GetLicensesSuccess;
  constructor(public licenses: LicenseDTO[]) {}
}
export class GetLicensesFailed implements Action {
  readonly type = LicensesActions.GetLicensesFailed;
}

export class SetLicenseData implements Action {
  readonly type = LicensesActions.SetLicenseData;
  constructor(public license: LicenseDTO) {}
}

export class DeleteLicense implements Action {
  readonly type = LicensesActions.DeleteLicense;
  constructor(public ownerName: string) {}
}

export class AddLicense implements Action {
  readonly type = LicensesActions.AddLicense;
  constructor(public license: LicenseDTO) {}
}

export class SetLicensesInitialState implements Action {
  readonly type = LicensesActions.SetLicensesInitialState;
}

export type LicensesActionsTypes =
  | GetLicenses
  | GetLicensesSuccess
  | GetLicensesFailed
  | SetLicenseData
  | DeleteLicense
  | AddLicense
  | SetLicensesInitialState;
