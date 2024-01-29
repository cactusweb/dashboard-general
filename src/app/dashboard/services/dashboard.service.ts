import { Injectable, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Requests } from '@csd-consts/requests.consts';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { LicenseDTO } from '@csd-models/license.models';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { HttpService } from '@csd-services/http/http.service';
import { SeoService } from '@csd-services/seo.service';
import {
  DeleteLicense,
  SetLicenseData,
} from '@csd-store/licenses/licenses.actions';
import { selectLicenses } from '@csd-store/licenses/licenses.selectors';
import { State } from '@csd-store/state';
import { distinctUntilChangedJSON } from '@csd-utils/distinct-until-changed-json.pipeline';
import { Store } from '@ngrx/store';
import {
  ReplaySubject,
  Subject,
  filter,
  map,
  share,
  shareReplay,
  takeUntil,
  tap,
} from 'rxjs';

@Injectable()
export class DashboardService implements OnDestroy {
  private readonly ownerName = this.getOwnerName();

  private readonly _license$ = new ReplaySubject<LicenseDTO>();
  readonly license$ = this._license$.asObservable().pipe(shareReplay());

  private readonly destroyed$ = new Subject<void>();

  private unbinded = false;

  constructor(
    private store: Store<State>,
    private snackbar: CsdSnackbarService,
    private router: Router,
    private http: HttpService,
    private seo: SeoService
  ) {
    this.getLicense();
  }

  ngOnDestroy(): void {
    this.seo.changeIcon();
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  resetActivations() {
    return this.http
      .request<LicenseDTO>(Requests.RESET_ACTIVATIONS, null, this.ownerName)
      .pipe(
        tap((license) => {
          this.store.dispatch(new SetLicenseData(license));

          this.snackbar.createItem(
            'Reset successfuly',
            CsdSnackbarLevels.SUCCESS
          );
        })
      );
  }

  joinDiscord() {
    return this.http
      .request<{ url: string }>(Requests.JOIN_DISCORD, null, this.ownerName)
      .pipe(
        tap((d) => {
          window.open(d.url, '_blank')?.focus();
          this.snackbar.createItem(
            'Joined to discord server',
            CsdSnackbarLevels.SUCCESS
          );
        })
      );
  }

  unbind() {
    return this.http
      .request<void>(Requests.UNBIND_LICENSE, null, this.ownerName)
      .pipe(
        tap(() => {
          this.unbinded = true;
          this.router.navigate([RouterPaths.LICENSES]);
          this.store.dispatch(new DeleteLicense(this.ownerName));
          this.snackbar.createItem('License unbinded', CsdSnackbarLevels.ERROR);
        })
      );
  }

  private getOwnerName() {
    return (
      inject(ActivatedRoute).snapshot.params['owner_name'] as string
    ).replace('-', ' ');
  }

  private getLicense() {
    this.store
      .select(selectLicenses)
      .pipe(
        takeUntil(this.destroyed$),
        distinctUntilChangedJSON(),
        filter((licenses) => !!licenses),
        map((licenses) =>
          licenses!.find((lic) => lic.owner.name === this.ownerName)
        ),
        tap((lic) => {
          if (this.unbinded) {
            throw new Error('Licenses undinded');
          }
          if (!lic) {
            const msg = `You don't have license of ${this.ownerName}.`;
            this.snackbar.createItem(msg, CsdSnackbarLevels.ERROR);
            this.router.navigate([RouterPaths.LICENSES]);
            throw new Error(msg);
          }
        }),
        map((d) => d as LicenseDTO),
        tap((lic) => {
          this.seo.changeTitle(lic.owner.name + ' - Dashboard');
          if (lic.owner.avatar) {
            this.seo.changeIcon(lic.owner.avatar);
          }
        }),
        distinctUntilChangedJSON()
      )
      .subscribe({
        next: (lic) => this._license$.next(lic),
        error: () => {},
      });
  }
}
