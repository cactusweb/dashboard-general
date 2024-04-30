import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  MobileSolanaActions,
  MobileSolanaOnConnect,
  MobileSolanaOnDisconnect,
} from './mobile-solana.actions';
import { tap } from 'rxjs';
import { MOBILE_SOLANA_STATE_KEY } from './mobile-solana.selectors';

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

  constructor(private actions$: Actions) {}
}
