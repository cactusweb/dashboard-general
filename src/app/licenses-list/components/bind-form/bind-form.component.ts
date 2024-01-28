import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Requests } from '@csd-consts/requests.consts';
import { LicenseDTO } from '@csd-models/license.models';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { HttpService } from '@csd-services/http/http.service';
import { AddLicense } from '@csd-store/licenses/licenses.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: './csd-bind-form',
  templateUrl: './bind-form.component.html',
  styleUrls: ['./bind-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BindFormComponent {
  readonly loading$ = new BehaviorSubject(false);

  readonly form = new FormGroup({
    key: new FormControl('', Validators.required),
  });

  constructor(
    private http: HttpService,
    private store: Store<State>,
    private snackbar: CsdSnackbarService,
    private matDialogRef: MatDialogRef<BindFormComponent>
  ) {}

  onBind() {
    this.loading$.next(true);
    this.http
      .request<LicenseDTO>(Requests.BIND_LICENSES, this.form.value)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (lic) => {
          this.store.dispatch(new AddLicense(lic));
          this.snackbar.createItem(
            'License binded!',
            CsdSnackbarLevels.SUCCESS
          );
          this.matDialogRef.close();
        },
      });
  }
}
