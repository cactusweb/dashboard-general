import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of, switchMap, take, tap } from 'rxjs';
import {
  Auth,
  AuthActions,
  AuthLogout,
  AuthSuccess,
  SetAuthInitialState,
} from './auth.actions';
import { Router } from '@angular/router';
import { AuthService } from '@csd-services/auth.service';
import { SetUserInitialState } from '@csd-store/user/user.actions';
import { SetLicensesInitialState } from '@csd-store/licenses/licenses.actions';
import { isPlatformBrowser } from '@angular/common';
import { CookieService } from '@csd-services/cookie/cookie.service';
import { ACCESS_TOKEN_KEY } from '@csd-consts/auth.consts';

@Injectable()
export class AuthEffects {
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType<AuthLogout>(AuthActions.AuthLogout),
      tap((data) => {
        this.cookieService.delete(ACCESS_TOKEN_KEY);
        this.router.navigate([data.redirectTo]);
      }),
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
          if (isPlatformBrowser(this.platformId)) {
            this.authService.auth(data.redirectToParam);
          }
        })
      ),
    { dispatch: false }
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType<AuthSuccess>(AuthActions.AuthSuccess),
        take(1),
        tap((data) => this.cookieService.set(ACCESS_TOKEN_KEY, data.authToken))
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthService,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
}
