import { SolanaProvidersTypes } from '../../solana/solana.models';
import { CommonSuccessResponse } from './mobile-solana.models';

export type ConnectionSuccessResponse = CommonSuccessResponse & {
  phantom_encryption_public_key: string;
  solflare_encryption_public_key: string;
};

export interface ConnectionDataDecripted {
  public_key: string;
  session: string;
}

