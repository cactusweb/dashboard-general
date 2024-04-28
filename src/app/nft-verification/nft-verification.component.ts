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
import {
  BehaviorSubject,
  Observable,
  filter,
  finalize,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SolProviderSelectorComponent } from './common/components/sol-provider-selector/sol-provider-selector.component';
import { SolanaProvidersTypes } from './common/services/models/solana.models';

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
    MatDialogModule,
    SolProviderSelectorComponent,
  ],
  providers: [NftVerificationService, CsdSolanaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NftVerificationComponent implements OnInit {
  @HostBinding('style.--primary-color')
  primaryColor: null | string = null;

  private readonly verificationStatus$ = this.verifService.verificationStatus$;
  readonly owner$ = this.verificationStatus$.pipe(map((d) => d.owner));
  readonly btnDisabled$ = this.verificationStatus$.pipe(
    map((d) => !d.enabled || d.hasLicense)
  );

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
    private router: Router,
    private matDialog: MatDialog
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
  }

  onRecieve() {
    this.loading$.next(true);

    this.store
      .select(selectIsAuthed)
      .pipe(
        take(1),
        tap((authed) => {
          if (authed) {
            return;
          }
          const msg = 'Redirecting to auth...';
          this.snackbarService.createItem(msg, CsdSnackbarLevels.INFO);
          this.authService.auth();
          throw new Error(msg);
        }),
        switchMap(() => this.openSolProviderSelector()),
        take(1)
      )
      .subscribe({
        next: (selected) =>
          selected ? this.process() : this.loading$.next(false),
        error: () => {},
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
        map((lic) => this.mapLicense(lic)),
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
        error: (err) => {
          console.log(err);
          if (err.error?.url) {
            window.open(err.error?.url, '_blank');
          }
        },
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

  private mapLicense(lic: LicenseDTO) {
    return {
      ...lic,
      expires_in: lic.expires_in ? lic.expires_in * 1000 : lic.expires_in,
      created_at: lic.created_at * 1000,
      bought_at: lic.bought_at * 1000,
    } as LicenseDTO;
  }

  private openSolProviderSelector() {
    const onSelectProvider = (type: SolanaProvidersTypes) =>
      this.solanaService.selectProvider(type);

    return this.matDialog
      .open(SolProviderSelectorComponent, {
        maxWidth: '400px',
        width: '100%',
        autoFocus: false,
        restoreFocus: false,
        data: onSelectProvider,
      })
      .beforeClosed() as Observable<boolean | undefined>;
  }
}
