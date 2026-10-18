import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Requests } from '@csd-consts/requests.consts';
import {
  UserDetailsFormData,
  UserDetailsFormComponent,
} from '@csd-components/user-details-form/user-details-form.component';
import { UserDTO } from '@csd-models/user.models';
import { HttpService } from '@csd-services/http/http.service';
import { GetUserSuccess } from '@csd-store/user/user.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import {
  Observable,
  EMPTY,
  catchError,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { isUserDetailsRequiredErr } from '@csd-utils/user-details.utils';

@Injectable({
  providedIn: 'root',
})
export class UserDetailsService {
  constructor(
    private matDialog: MatDialog,
    private http: HttpService,
    private store: Store<State>,
  ) {}

  /**
   * Opens the shared details dialog.
   * Emits the saved user after a successful save; nothing when dismissed.
   */
  openDetailsForm(
    mode: UserDetailsFormData['mode'],
  ): Observable<UserDTO | undefined> {
    return this.matDialog
      .open(UserDetailsFormComponent, {
        maxWidth: mode === 'full' ? '500px' : '450px',
        width: '100%',
        data: { mode },
      })
      .afterClosed();
  }

  /** Saves the email to the profile and syncs the user store. */
  saveEmail(email: string): Observable<UserDTO> {
    return this.putUserData({ email });
  }

  /**
   * Retries a request once after a successful details save when it is
   * rejected with the user-details gate error
   * (`user_details_required` / `Please fill in your profile details
   * before purchasing`). A dismissed dialog cancels
   * the request.
   */
  retryOnUserDetailsRequired<T>(request$: Observable<T>): Observable<T> {
    return request$.pipe(
      catchError((err) => {
        if (!isUserDetailsRequiredErr(err)) {
          return throwError(() => err);
        }

        return this.openDetailsForm('full').pipe(
          switchMap((saved) => (saved ? request$ : EMPTY)),
        );
      }),
    );
  }

  private putUserData(data: Partial<UserDTO>): Observable<UserDTO> {
    return this.http
      .request<UserDTO>(Requests.PUT_USER_DATA, data)
      .pipe(tap((user) => this.store.dispatch(new GetUserSuccess(user))));
  }
}
