import { LicenseDTO } from '@csd-models/license.models';
import { LicensesActions, LicensesActionsTypes } from './licenses.actions';
import { LicensesState, initialLicensesState } from './licenses.selectors';

export const licensesRedusers = (
  state = initialLicensesState,
  action: LicensesActionsTypes
): LicensesState => {
  switch (action.type) {
    case LicensesActions.GetLicenses:
      return {
        ...state,
        pending: true,
      };
    case LicensesActions.GetLicensesSuccess:
      return {
        data: action.licenses,
        pending: false,
      };
    case LicensesActions.GetLicensesFailed:
      return {
        ...state,
        pending: false,
      };
    case LicensesActions.SetLicenseData:
      return {
        ...state,
        data: putLicense(action.license, state.data!),
      };
    case LicensesActions.DeleteLicense:
      return {
        ...state,
        data: deleteLicense(action.ownerName, state.data!),
      };
    case LicensesActions.AddLicense:
      return {
        ...state,
        data: !state.data
          ? null
          : [
              ...state.data.filter((l) => l.id !== action.license.id),
              action.license,
            ],
      };
    case LicensesActions.SetLicensesInitialState:
      return initialLicensesState;
    default:
      return state;
  }
};

function putLicense(license: LicenseDTO, licensesList: LicenseDTO[]) {
  return licensesList.map((lic) => {
    if (lic.id !== license.id) {
      return lic;
    }
    return license;
  });
}

function deleteLicense(ownerName: string, licenses: LicenseDTO[]) {
  return licenses.filter(
    (lic) => lic.owner.name.toLowerCase() !== ownerName.toLowerCase()
  );
}
