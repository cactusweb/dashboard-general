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
import { selectAuthToken } from '@csd-store/auth/auth.selectors';
import { Auth } from '@csd-store/auth/auth.actions';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { AuthService } from '@csd-services/auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  constructor(
    private store: Store<State>,
    private snackbarService: CsdSnackbarService,
    private authService: AuthService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return combineLatest([
      this.store.select(selectAuthToken),
      this.authService.pending$,
    ]).pipe(
      take(1),
      switchMap(([authToken, pending]) => {
        if (authToken) {
          return next.handle(this.setAuthHeader(req, authToken));
        }

        if (!pending) {
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
