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
import { catchError, map, switchMap, throwError } from 'rxjs';
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
      map((licenses) =>
        licenses.map((lic) => ({
          ...lic,
          expires_in: lic.expires_in ? lic.expires_in * 1000 : null,
          created_at: lic.created_at * 1000,
          bought_at: lic.created_at * 1000,
        }))
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
