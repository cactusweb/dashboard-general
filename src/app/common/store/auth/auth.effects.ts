import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, tap } from 'rxjs';
import {
  Auth,
  AuthActions,
  AuthLogout,
  SetAuthInitialState,
} from './auth.actions';
import { Router } from '@angular/router';
import { RouterPaths } from 'app/common/consts/router-paths.conts';
import { AuthService } from 'app/common/services/auth.service';

@Injectable()
export class AuthEffects {
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthLogout>(AuthActions.AuthLogout),
      tap((data) => this.router.navigate([data.redirectTo])),
      switchMap(() => [new SetAuthInitialState()])
    )
  );

  auth$ = createEffect(() =>
    this.actions$.pipe(
      ofType<Auth>(AuthActions.Auth),
      tap((data) => {
        this.authService.auth(data.redirectToParam);
      })
    )
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService
  ) {}
}
