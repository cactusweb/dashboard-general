import { Injectable } from '@angular/core';
import { HttpService } from '@csd-services/http/http.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { GetUserFailed, GetUserSuccess, UserActions } from './user.actions';
import { catchError, switchMap, throwError } from 'rxjs';
import { UserDTO } from '@csd-models/user.models';
import { Requests } from '@csd-consts/requests.consts';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';

@Injectable()
export class UserEffects {
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.GetUser),
      switchMap(() =>
        this.http.request<UserDTO>(Requests.GET_ME).pipe(
          catchError((err) => {
            this.store.dispatch(new GetUserFailed());
            return throwError(() => err);
          }),
          switchMap((user) => [new GetUserSuccess(user)])
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private http: HttpService,
    private store: Store<State>
  ) {}
}
