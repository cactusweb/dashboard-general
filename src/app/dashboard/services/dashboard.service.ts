import { Injectable, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Requests } from '@csd-consts/requests.consts';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { RenewSuccessComponent } from '@csd-dashboard/common/components/renew-success.component';
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
  shareReplay,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import * as dateFns from 'date-fns';
import { MatDialog } from '@angular/material/dialog';
import { OwnerDTO } from '@csd-models/owner.models';
import { selectIsAuthed } from '@csd-store/auth/auth.selectors';

@Injectable()
export class DashboardService implements OnDestroy {
  private readonly ownerName = this.getOwnerName();

  private readonly _license$ = new ReplaySubject<LicenseDTO>();
  readonly license$ = this._license$.asObservable().pipe(shareReplay());

  readonly owner$ = this.getOwner().pipe(shareReplay());
  readonly ownerName$ = this.owner$.pipe(
    map((owner) => owner.name),
    shareReplay()
  );

  private readonly destroyed$ = new Subject<void>();

  private unbinded = false;

  constructor(
    private store: Store<State>,
    private snackbar: CsdSnackbarService,
    private router: Router,
    private http: HttpService,
    private seo: SeoService,
    private matDialog: MatDialog
  ) {
    this.getLicense();
  }

  ngOnDestroy(): void {
    this.seo.changeIcon();
    this.destroyed$.next();
    this.destroyed$.complete();
    this._license$.complete();
  }

  resetActivations() {
    return this.http
      .request<LicenseDTO>(Requests.RESET_ACTIVATIONS, null, this.ownerName)
      .pipe(
        map((lic) => ({
          ...lic,
          expires_in: lic.expires_in ? lic.expires_in * 1000 : lic.expires_in,
          created_at: lic.created_at * 1000,
          bought_at: lic.bought_at * 1000,
        })),
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

  handleSuccefullRenew() {
    this.license$.pipe(take(1)).subscribe((lic) => {
      const newLicData = {
        ...lic,
        expires_in: dateFns.addMonths(lic.expires_in!, 1).getTime(),
      };

      this.store.dispatch(new SetLicenseData(newLicData));

      this.matDialog.open(RenewSuccessComponent, {
        maxWidth: '405px',
        width: '100%',
      });
    });
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
        distinctUntilChangedJSON()
      )
      .subscribe({
        next: (lic) => this._license$.next(lic),
        error: () => {},
      });
  }

  private getOwner() {
    return this.store
      .select(selectIsAuthed)
      .pipe(
        switchMap((authed) => {
          if (!authed) {
            return this.http.request<OwnerDTO>(
              Requests.GET_OWNER,
              null,
              this.ownerName
            );
          }

          return this._license$.pipe(map((d) => d.owner));
        })
      )
      .pipe(
        tap((owner) => {
          this.seo.changeTitle(owner.name + ' - Dashboard | CactusDash');
          if (owner.avatar) {
            this.seo.changeIcon(owner.avatar);
          }
        })
      );
  }
}
