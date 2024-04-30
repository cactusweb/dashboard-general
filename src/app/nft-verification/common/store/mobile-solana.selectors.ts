import { State } from '@csd-store/state';
import { SolanaProvidersTypes } from '../services/solana/solana.models';
import { createSelector } from '@ngrx/store';

export type MobileSolanaState = {
  walletProvider: SolanaProvidersTypes | null;
  session: string | null;
  publicKey: string | null;
  encryptionPublicKey: string | null;
};

export const initialMobileSolanaState: MobileSolanaState = {
  walletProvider: null,
  session: null,
  publicKey: null,
  encryptionPublicKey: null,
};

const mobileSolanaState = (state: State) => state.mobileSolana;

export const selectMobileSolanaState = createSelector(
  mobileSolanaState,
  (state) => state
);

export const selectMobileSolanaConnected = createSelector(
  mobileSolanaState,
  (state) => !!state.session
);

export const selectMobileSolanaWalletAddress = createSelector(
  mobileSolanaState,
  (state) => state.publicKey!
);

export const selectMobileSolanaSession = createSelector(
  mobileSolanaState,
  (state) => state.session!
);

export const selectMobileSolanaEncryptionPublicKey = createSelector(
  mobileSolanaState,
  (state) => state.encryptionPublicKey!
);

export const selectMobileSolanaProvider = createSelector(
  mobileSolanaState,
  (state) => state.walletProvider!
);
