import { Action } from '@ngrx/store';
import { MobileSolanaState } from './mobile-solana.selectors';

export enum MobileSolanaActions {
  OnConnect = '[MobileSolana] OnSuccessConnect',
  OnDisconnect = '[MobileSolana] Disconnect',
}

export class MobileSolanaOnConnect implements Action {
  readonly type = MobileSolanaActions.OnConnect;
  constructor(public state: MobileSolanaState) {}
}

export class MobileSolanaOnDisconnect implements Action {
  readonly type = MobileSolanaActions.OnDisconnect;
}

export type MobileSolanaActionsType =
  | MobileSolanaOnConnect
  | MobileSolanaOnDisconnect;
