import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, combineLatest, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import {
  selectAuthIsPending,
  selectAuthState,
  selectAuthToken,
} from '@csd-store/auth/auth.selectors';
import { Auth } from '@csd-store/auth/auth.actions';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<State>,
    private snackbarService: CsdSnackbarService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select(selectAuthState).pipe(
      take(1),
      switchMap((state) => {
        if (state.data?.authToken) {
          return next.handle(this.setAuthHeader(req, state.data.authToken));
        }
        if (!state.pending) {
          this.snackbarService.createItem(
            'Have no auth. Redirecting...',
            CsdSnackbarLevels.ERROR
          );
          this.store.dispatch(new Auth());
        }
        return EMPTY;
      })
    );
  }

  setAuthHeader(
    req: HttpRequest<unknown>,
    accessToken: string
  ): HttpRequest<unknown> {
    return req.clone({
      headers: req.headers.set('authorization', `Bearer ${accessToken}`),
    });
  }
}
