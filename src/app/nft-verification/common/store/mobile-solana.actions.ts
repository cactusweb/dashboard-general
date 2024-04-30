import { Action } from '@ngrx/store';
import { MobileSolanaState } from './mobile-solana.selectors';
import { SolanaProvidersTypes } from '../services/solana/solana.models';

export enum MobileSolanaActions {
  OnConnect = '[MobileSolana] OnSuccessConnect',
  OnDisconnect = '[MobileSolana] OnDisconnect',
  OnSelectProvider = '[MobileSolana] OnSelectProvider',
}

export class MobileSolanaOnConnect implements Action {
  readonly type = MobileSolanaActions.OnConnect;
  constructor(public state: MobileSolanaState) {}
}

export class MobileSolanaOnDisconnect implements Action {
  readonly type = MobileSolanaActions.OnDisconnect;
}

export class MobileSolanaOnSelectProvider implements Action {
  readonly type = MobileSolanaActions.OnSelectProvider;
  constructor(public provider: SolanaProvidersTypes) {}
}

export type MobileSolanaActionsType =
  | MobileSolanaOnConnect
  | MobileSolanaOnDisconnect
  | MobileSolanaOnSelectProvider;
