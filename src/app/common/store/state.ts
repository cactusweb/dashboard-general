import { MobileSolanaState, initialMobileSolanaState } from 'app/nft-verification/common/store/mobile-solana.selectors';
import { AuthState, initialAuthState } from './auth/auth.selectors';
import {
  LicensesState,
  initialLicensesState,
} from './licenses/licenses.selectors';
import { UserState, initialUserState } from './user/user.selectors';

export interface State {
  auth: AuthState;
  user: UserState;
  licenses: LicensesState;
  mobileSolana: MobileSolanaState,
}

export const initialState: State = {
  auth: initialAuthState,
  user: initialUserState,
  licenses: initialLicensesState,
  mobileSolana: initialMobileSolanaState,
};

export function getInitialState(): State {
  return initialState;
}
