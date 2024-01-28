import { LicenseDTO } from '@csd-models/license.models';
import { State } from '@csd-store/state';

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

const licenseState = (state: State) => state