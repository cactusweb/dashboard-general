import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, take, tap } from 'rxjs';
import {
  Auth,
  AuthActions,
  AuthLogout,
  SetAuthInitialState,
} from './auth.actions';
import { Router } from '@angular/router';
import { AuthService } from '@csd-services/auth.service';
import { SetUserInitialState } from '@csd-store/user/user.actions';
import { SetLicensesInitialState } from '@csd-store/licenses/licenses.actions';

@Injectable()
export class AuthEffects {
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthLogout>(AuthActions.AuthLogout),
      tap((data) => this.router.navigate([data.redirectTo])),
      switchMap(() => [
        new SetAuthInitialState(),
        new SetUserInitialState(),
        new SetLicensesInitialState(),
      ])
    )
  );

  auth$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType<Auth>(AuthActions.Auth),
        take(1),
        tap((data) => {
          this.authService.auth(data.redirectToParam);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService
  ) {}
}
