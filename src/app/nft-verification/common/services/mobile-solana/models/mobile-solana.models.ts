import { SolanaProvidersTypes } from '../../solana/solana.models';

export interface CommonMethodParams {
  app_url: string;
  dapp_encryption_public_key: string;
  redirect_link: string;
}

export interface CommonErrorResonse {
  errorCode: string;
  errorMessage: string;
}

export interface CommonSuccessResponse {
  data: string;
  nonce: string;
}

export const enum MobileSolanaMethods {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  SIGN_MESSAGE = 'signMessage',
}

export const enum MobileSolanaStates {
  DEFAULT = 'DEFAULT',
  SIGN_MESSAGE = 'SIGN_MESSAGE',
  GET_LICENSE = 'GET_LICENCE',
}
