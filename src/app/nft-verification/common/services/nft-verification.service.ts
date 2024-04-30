import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '@csd-services/http/http.service';
import { NftVerificationStatusDTO } from '../models/nft-verification.models';
import { NftVerificationRequests } from '../consts/nft-verification.requests';
import { catchError, map, shareReplay, tap, throwError } from 'rxjs';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { SeoService } from '@csd-services/seo.service';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { LicenseDTO } from '@csd-models/license.models';
import { AddLicense } from '@csd-store/licenses/licenses.actions';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';

@Injectable()
export class NftVerificationService {
  readonly ownerName = this.getOwnerName();
  readonly verificationStatus$ = this.getVerificationStatus();

  constructor(
    private router: Router,
    private seo: SeoService,
    private snackbar: CsdSnackbarService,
    private http: HttpService,
    private store: Store<State>
  ) {}

  getLicense(wallet: string, signature: string) {
    return this.http
      .request<LicenseDTO>(
        NftVerificationRequests.GET_LICENSE,
        {
          wallet,
          signature,
        },
        this.ownerName
      )
      .pipe(
        map((lic) => this.mapLicense(lic)),
        tap((lic) => {
          this.store.dispatch(new AddLicense(lic));
          this.navigateToDashboard();
        }),
        catchError((err) => {
          if (err.error?.url) {
            window.open(err.error?.url, '_blank');
          }
          return throwError(() => err);
        })
      );
  }

  private mapLicense(lic: LicenseDTO) {
    return {
      ...lic,
      expires_in: lic.expires_in ? lic.expires_in * 1000 : lic.expires_in,
      created_at: lic.created_at * 1000,
      bought_at: lic.bought_at * 1000,
    } as LicenseDTO;
  }

  private navigateToDashboard() {
    const dashLink = RouterPaths.DASHBOARD.replace(
      ':owner_name',
      this.ownerName
    );
    this.router.navigate([`/${dashLink}`]);
  }

  private getOwnerName() {
    return (
      inject(ActivatedRoute).snapshot.params['owner_name'] as string
    ).replaceAll('-', ' ');
  }

  private getVerificationStatus() {
    return inject(HttpService)
      .request<NftVerificationStatusDTO>(
        NftVerificationRequests.GET_STATUS,
        null,
        this.ownerName
      )
      .pipe(
        catchError((err) => {
          if (err.error?.message === 'Owner not found') {
            this.router.navigate(['/' + RouterPaths.NOT_FOUND]);
          }
          return throwError(() => err);
        }),
        tap((data) => {
          this.seo.setOwnerData(data.owner, 'NFT Verification');
        }),
        tap((data) => {
          if (data.hasLicense) {
            this.snackbar.createItem(
              `You are already have license.`,
              CsdSnackbarLevels.ERROR
            );
          } else if (!data.enabled) {
            this.snackbar.createItem(
              `NFT Verification is disabled.`,
              CsdSnackbarLevels.ERROR
            );
          }
        }),
        shareReplay()
      );
  }
}
