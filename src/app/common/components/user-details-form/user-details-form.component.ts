import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { Requests } from '@csd-consts/requests.consts';
import { UserDTO } from '@csd-models/user.models';
import { CountriesService } from '@csd-services/countries.service';
import { HttpService } from '@csd-services/http/http.service';
import { GetUserSuccess } from '@csd-store/user/user.actions';
import { selectUser } from '@csd-store/user/user.selectors';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, finalize, take } from 'rxjs';

export interface UserDetailsFormData {
  mode: 'full' | 'email';
}

const NAME_PATTERN = /^[A-Za-z\s'-]+$/;

@Component({
  selector: 'csd-user-details-form',
  templateUrl: './user-details-form.component.html',
  styleUrls: ['./user-details-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgVarDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserDetailsFormComponent {
  readonly isFullMode: boolean;
  readonly form: FormGroup;
  readonly countries$ = this.countriesService.countries$;
  readonly loading$;
  readonly error$;

  private readonly _loading$ = new BehaviorSubject(false);
  private readonly _error$ = new BehaviorSubject<string | null>(null);

  constructor(
    private countriesService: CountriesService,
    private http: HttpService,
    private matDialogRef: MatDialogRef<UserDetailsFormComponent>,
    private store: Store<State>,
    @Inject(MAT_DIALOG_DATA) dialogData: UserDetailsFormData,
  ) {
    this.isFullMode = dialogData.mode === 'full';
    this.form = this.buildForm();
    this.loading$ = this._loading$.asObservable();
    this.error$ = this._error$.asObservable();
    this.prefillForm();
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this._loading$.next(true);
    this._error$.next(null);

    this.http
      .request<UserDTO>(Requests.PUT_USER_DATA, this.form.value)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe({
        next: (user) => {
          this.store.dispatch(new GetUserSuccess(user));
          this.matDialogRef.close(user);
        },
        error: (err) =>
          this._error$.next(err?.error?.message || 'Saving failed'),
      });
  }

  private buildForm() {
    const email = new FormControl('', [Validators.required, Validators.email]);

    if (!this.isFullMode) {
      return new FormGroup({ email });
    }

    const nameValidators = [
      Validators.required,
      Validators.maxLength(64),
      Validators.pattern(NAME_PATTERN),
    ];

    return new FormGroup({
      email,
      first_name: new FormControl('', nameValidators),
      last_name: new FormControl('', nameValidators),
      country: new FormControl('', Validators.required),
    });
  }

  private prefillForm() {
    this.store
      .select(selectUser)
      .pipe(take(1))
      .subscribe((user) => {
        if (!user) {
          return;
        }

        this.form.patchValue({
          email: user.email || '',
          ...(this.isFullMode && {
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            country: user.country || '',
          }),
        });
      });
  }
}
