import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnInit,
  inject,
} from '@angular/core';
import { HttpService } from '@csd-services/http/http.service';
import { NftVerificationRequests } from './common/consts/nft-verification.requests';
import { NftVerificationBtnStates } from './common/models/nft-verification.models';
import { BehaviorSubject, finalize, map, switchMap, take } from 'rxjs';
import { NftVerificationService } from './common/services/nft-verification.service';
import { CsdSolanaService } from './common/services/solana.service';
import { LicenseDTO } from '@csd-models/license.models';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { selectIsAuthed } from '@csd-store/auth/auth.selectors';
import { AuthService } from '@csd-services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CsdOwnerDataComponent } from '@csd-components/owner-data/owner-data.component';
import { MatButtonModule } from '@angular/material/button';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AddLicense } from '@csd-store/licenses/licenses.actions';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environment/environment';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';

@Component({
  selector: 'csd-nft-verification',
  templateUrl: './nft-verification.component.html',
  styleUrls: ['./nft-verification.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    CsdOwnerDataComponent,
    MatButtonModule,
    NgVarDirective,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  providers: [NftVerificationService, CsdSolanaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NftVerificationComponent implements OnInit {
  @HostBinding('style.--primary-color')
  primaryColor: null | string = null;

  readonly verificationStatus$ = this.verifService.verificationStatus$;
  readonly owner$ = this.verificationStatus$.pipe(map((d) => d.owner));

  readonly loading$ = new BehaviorSubject(false);
  btnText = NftVerificationBtnStates.INITIAL;

  constructor(
    private http: HttpService,
    private verifService: NftVerificationService,
    private solanaService: CsdSolanaService,
    private cdr: ChangeDetectorRef,
    private store: Store<State>,
    private snackbarService: CsdSnackbarService,
    private authService: AuthService,
    private router: Router
  ) {
    inject(MatIconRegistry).addSvgIcon(
      'icon_solana',
      inject(DomSanitizer).bypassSecurityTrustResourceUrl(
        environment.siteUrl + '/assets/svg-icons/solana.svg'
      )
    );
  }

  ngOnInit(): void {
    this.getPrimaryColor();
    setTimeout(() => {
      this.navigateToDashboard();
    }, 1000);
  }

  onRecieve() {
    this.loading$.next(true);

    this.store
      .select(selectIsAuthed)
      .pipe(take(1))
      .subscribe((authed) => {
        if (authed) {
          this.process();
        } else {
          this.snackbarService.createItem(
            'No have auth. Redirecting...',
            CsdSnackbarLevels.ERROR
          );
          this.authService.auth();
        }
      });
  }

  private process() {
    this.setBtnText(NftVerificationBtnStates.WALLET_CONNECTING);

    this.solanaService
      .connect()
      .pipe(
        switchMap((wallet) => {
          this.setBtnText(NftVerificationBtnStates.NONCE_GETTING);
          return this.http.request<{ nonce: string }>(
            NftVerificationRequests.GET_NONCE,
            {
              wallet,
            }
          );
        }),
        switchMap((d) => {
          this.setBtnText(NftVerificationBtnStates.SIGNING);
          return this.solanaService.signMessage(d.nonce);
        }),
        switchMap((d) => {
          this.setBtnText(NftVerificationBtnStates.LICENSE_GETTING);
          return this.http.request<LicenseDTO>(
            NftVerificationRequests.GET_LICENSE,
            {
              wallet: d.publicKey,
              signature: d.signature,
            },
            this.verifService.ownerName
          );
        }),
        map(
          (lic) =>
            ({
              ...lic,
              expires_in: lic.expires_in
                ? lic.expires_in * 1000
                : lic.expires_in,
              created_at: lic.created_at * 1000,
              bought_at: lic.bought_at * 1000,
            } as LicenseDTO)
        ),
        finalize(() => {
          this.setBtnText(NftVerificationBtnStates.INITIAL);
          this.loading$.next(false);
        })
      )
      .subscribe({
        next: (license) => {
          this.store.dispatch(new AddLicense(license));
          this.navigateToDashboard();
        },
        error: () => {},
      });
  }

  private setBtnText(text: NftVerificationBtnStates) {
    this.btnText = text;
    this.cdr.markForCheck();
  }

  private getPrimaryColor() {
    this.owner$
      .pipe(map((owner) => owner.primary_color))
      .subscribe((res) => (this.primaryColor = res));
  }

  private navigateToDashboard() {
    const dashLink = RouterPaths.DASHBOARD.replace(
      ':owner_name',
      this.verifService.ownerName
    );
    this.router.navigate([`/${dashLink}`]);
  }
}
