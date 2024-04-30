import {
  MobileSolanaActions,
  MobileSolanaActionsType,
} from './mobile-solana.actions';
import {
  MobileSolanaState,
  initialMobileSolanaState,
} from './mobile-solana.selectors';

export const mobileSolanaRedusers = (
  state = initialMobileSolanaState,
  action: MobileSolanaActionsType
): MobileSolanaState => {
  switch (action.type) {
    case MobileSolanaActions.OnConnect:
      return action.state;
    case MobileSolanaActions.OnDisconnect:
      return initialMobileSolanaState;
    case MobileSolanaActions.OnSelectProvider:
      return {
        ...initialMobileSolanaState,
        walletProvider: action.provider
      }
    default:
      return state;
  }
};
