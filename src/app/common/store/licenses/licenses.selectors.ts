import { LicenseDTO } from '@csd-models/license.models';
import { State } from '@csd-store/state';
import { createSelector } from '@ngrx/store';

export interface LicensesState {
  data: {
    licenses: LicenseDTO[];
  } | null;
  pending: boolean;
}

export const initialLicensesState: LicensesState = {
  data: null,
  pending: false,
};

const licenseState = (state: State) => state.licenses;

export const selectLicensesState = createSelector(
  licenseState,
  (state) => state
);

export const selectLicenses = createSelector(
  licenseState,
  (state) => state.data?.licenses
);

export const selectLicensesPending = createSelector(
  licenseState,
  (state) => state.pending
);
