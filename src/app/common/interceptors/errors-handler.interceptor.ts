import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, filter, Observable, take, throwError } from 'rxjs';
import { ErrorEnum } from './error.enums';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { Auth } from '@csd-store/auth/auth.actions';
import { AuthService } from '@csd-services/auth.service';
import { UtilsService } from '@csd-services/utils.service';

@Injectable()
export class ErrorsHandlerInterceptor implements HttpInterceptor {
  constructor(
    private snackbarService: CsdSnackbarService,
    private utilsService: UtilsService,
    private store: Store<State>,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.handleError(err, request.headers.has('no-handle-error'));
        return throwError(() => err);
      })
    );
  }

  generateNotification(message: string): void {
    this.snackbarService.createItem(message, CsdSnackbarLevels.ERROR);
  }

  private handleError(err: any, noHandleBadReq: boolean = false) {
    if (err.status < 500 && err?.error?.message)
      err.error.message = this.utilsService.capitalizeFirstLetter(
        err.error.message
      );

    if (err.status === 0) {
      err.message = 'Connection timeout';
      this.generateNotification(ErrorEnum.ConnectionTimeout);
    } else if (err.status === 404) {
      err.message = ErrorEnum.NotFound;
      this.generateNotification(ErrorEnum.NotFound);
    } else if (err.status === 401) {
      this.onAuthErr();
      this.generateNotification(ErrorEnum.NotAuth);
    } else if (err.status >= 500) {
      this.generateNotification(
        (typeof err.error.message === 'string' && err.error.message) ||
          `Error ${err.status}: ${ErrorEnum.ServerUnavailable}`
      );
      err.message = ErrorEnum.ServerUnavailable;
    } else if (err.status >= 400 && err.status <= 500 && !noHandleBadReq) {
      this.generateNotification(
        `${err.error.message || err.error.error || err.message}`
      );
    }
  }

  private onAuthErr() {
    this.authService.pending$
      .pipe(
        take(1),
        filter((d) => !d)
      )
      .subscribe(() => {
        this.store.dispatch(new Auth());
      });
  }
}
