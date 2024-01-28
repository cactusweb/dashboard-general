import { Injectable } from '@angular/core';
import { HttpService } from '@csd-services/http/http.service';
import { State } from '@csd-store/state';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  GetLicensesFailed,
  GetLicensesSuccess,
  LicensesActions,
} from './licenses.actions';
import { catchError, switchMap, throwError } from 'rxjs';
import { LicenseDTO } from '@csd-models/license.models';
import { Requests } from '@csd-consts/requests.consts';

@Injectable()
export class LicensesEffects {
  getLicenses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LicensesActions.GetLicenses),
      switchMap(() =>
        this.http.request<LicenseDTO[]>(Requests.GET_LICENSES).pipe(
          catchError((err) => {
            this.store.dispatch(new GetLicensesFailed());
            return throwError(() => err);
          })
        )
      ),
      switchMap((licenses) => [new GetLicensesSuccess(licenses)])
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpService,
    private store: Store<State>
  ) {}
}
