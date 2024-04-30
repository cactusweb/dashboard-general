import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  MobileSolanaActions,
  MobileSolanaOnConnect,
  MobileSolanaOnDisconnect,
  MobileSolanaOnSelectProvider,
} from './mobile-solana.actions';
import { tap } from 'rxjs';
import {
  MOBILE_SOLANA_STATE_KEY,
  initialMobileSolanaState,
} from './mobile-solana.selectors';

@Injectable()
export class MobileSolanaEffects {
  onConnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<MobileSolanaOnConnect>(MobileSolanaActions.OnConnect),
        tap((data) => {
          localStorage.setItem(
            MOBILE_SOLANA_STATE_KEY,
            JSON.stringify(data.state)
          );
        })
      ),
    {
      dispatch: false,
    }
  );

  onDisconnect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<MobileSolanaOnDisconnect>(MobileSolanaActions.OnDisconnect),
        tap(() => {
          localStorage.removeItem(MOBILE_SOLANA_STATE_KEY);
        })
      ),
    { dispatch: false }
  );

  onSelectProvider$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<MobileSolanaOnSelectProvider>(
          MobileSolanaActions.OnSelectProvider
        ),
        tap((d) => {
          localStorage.setItem(
            MOBILE_SOLANA_STATE_KEY,
            JSON.stringify({
              ...initialMobileSolanaState,
              provider: d.provider,
            })
          );
        })
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
