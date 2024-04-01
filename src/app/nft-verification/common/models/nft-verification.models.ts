import { OwnerDTO } from '@csd-models/owner.models';

export interface NftVerificationStatusDTO {
  owner: OwnerDTO;
  enabled: boolean;
  hasLicense: boolean;
}

export const enum NftVerificationBtnStates {
  INITIAL = 'Get license',
  WALLET_CONNECTING = 'Connecting wallet..',
  NONCE_GETTING = 'Getting message...',
  SIGNING = 'Sign the message...',
  LICENSE_GETTING = 'Getting the license...',
}
