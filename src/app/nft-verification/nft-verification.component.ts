import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { NftVerificationService } from './common/services/nft-verification.service';
import { CsdSolanaService } from './common/services/solana/solana.service';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CsdOwnerDataComponent } from '@csd-components/owner-data/owner-data.component';
import { MatButtonModule } from '@angular/material/button';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environment/environment';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SolProviderSelectorComponent } from './common/components/sol-provider-selector/sol-provider-selector.component';
import { SolanaProvidersTypes } from './common/services/solana/solana.models';
import { CsdMobileSolanaService } from './common/services/mobile-solana/mobile-solana.service';
import {
  selectMobileSolanaConnected,
  selectMobileSolanaWalletAddress,
} from './common/store/mobile-solana.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MobileSolanaStates } from './common/services/mobile-solana/models/mobile-solana.models';

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
  providers: [NftVerificationService, CsdSolanaService, CsdMobileSolanaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NftVerificationComponent implements OnInit {
  @HostBinding('style.--primary-color')
  primaryColor: null | string = null;

  readonly owner$ = this.verifService.verificationStatus$.pipe(
    map((d) => d.owner)
  );

  readonly btnDisabled$ = this.verifService.verificationStatus$.pipe(
    map((d) => !d.enabled || d.hasLicense)
  );

  readonly loading$ = new BehaviorSubject(false);
  readonly btnText$ = new BehaviorSubject(NftVerificationBtnStates.INITIAL);

  readonly #destroyRef = inject(DestroyRef);

  constructor(
    private http: HttpService,
    private verifService: NftVerificationService,
    private solanaService: CsdSolanaService,
    private store: Store<State>,
    private matDialog: MatDialog,
    private mobileSolanaService: CsdMobileSolanaService
  ) {
    inject(MatIconRegistry).addSvgIcon(
      'icon_solana',
      inject(DomSanitizer).bypassSecurityTrustResourceUrl(
        environment.siteUrl + '/assets/svg-icons/solana.svg'
      )
    );

    this.listenMobileSolanaState();
  }

  private get isMobile() {
    return window.innerWidth <= 900;
  }

  ngOnInit(): void {
    this.getPrimaryColor();
  }

  onRecieve() {
    this.loading$.next(true);

    this.verifService
      .checkAuth()
      .pipe(
        switchMap(() => this.openSolProviderSelector()),
        take(1)
      )
      .subscribe({
        next: (selected) => {
          if (!selected) {
            this.loading$.next(false);
            return;
          }
          this.isMobile ? this.processMobile() : this.processPC();
        },
        error: () => {},
      });
  }

  private processMobile() {
    this.setBtnText(NftVerificationBtnStates.WALLET_CONNECTING);

    this.store
      .select(selectMobileSolanaConnected)
      .pipe(take(1))
      .subscribe((connected) => {
        if (!connected) {
          this.mobileSolanaService.connect();
        } else {
          this.signMessageMobile();
        }
      });
  }

  private signMessageMobile() {
    this.loading$.next(true);
    this.setBtnText(NftVerificationBtnStates.NONCE_GETTING);
    return this.store
      .select(selectMobileSolanaWalletAddress)
      .pipe(
        take(1),
        switchMap((wallet) => this.getNonce(wallet))
      )
      .subscribe({
        next: (nonce) => {
          this.setBtnText(NftVerificationBtnStates.SIGNING);
          this.mobileSolanaService.signMessage(nonce);
        },
        error: () => {
          this.setBtnText(NftVerificationBtnStates.INITIAL);
          this.loading$.next(false);
        },
      });
  }

  private processPC() {
    this.setBtnText(NftVerificationBtnStates.WALLET_CONNECTING);

    this.solanaService
      .connect()
      .pipe(
        switchMap((wallet) => this.getNonce(wallet)),
        switchMap((nonce) => {
          this.setBtnText(NftVerificationBtnStates.SIGNING);
          return this.solanaService.signMessage(nonce);
        }),
        switchMap((d) => {
          this.setBtnText(NftVerificationBtnStates.LICENSE_GETTING);
          return this.verifService.getLicense(d.publicKey, d.signature);
        }),
        finalize(() => {
          this.setBtnText(NftVerificationBtnStates.INITIAL);
          this.loading$.next(false);
        })
      )
      .subscribe({
        error: () => {},
      });
  }

  private setBtnText(text: NftVerificationBtnStates) {
    this.btnText$.next(text);
  }

  private getPrimaryColor() {
    this.owner$
      .pipe(
        map((owner) => owner.primary_color),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((res) => (this.primaryColor = res));
  }

  private openSolProviderSelector() {
    const onSelectProvider = (type: SolanaProvidersTypes) =>
      this.isMobile
        ? this.mobileSolanaService.selectProvider(type)
        : this.solanaService.selectProvider(type);

    const openDialog = () =>
      this.matDialog
        .open(SolProviderSelectorComponent, {
          maxWidth: '400px',
          width: '100%',
          autoFocus: false,
          data: onSelectProvider,
        })
        .beforeClosed() as Observable<boolean | undefined>;

    return this.store.select(selectMobileSolanaConnected).pipe(
      switchMap((connected) => {
        if (connected) {
          return of(true);
        }

        return openDialog();
      })
    );
  }

  private getNonce(wallet: string) {
    this.setBtnText(NftVerificationBtnStates.NONCE_GETTING);
    return this.http
      .request<{ nonce: string }>(NftVerificationRequests.GET_NONCE, {
        wallet,
      })
      .pipe(map((d) => d.nonce));
  }

  private listenMobileSolanaState() {
    this.mobileSolanaService.state$
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        switchMap((data) => {
          switch (data.state) {
            case MobileSolanaStates.SIGN_MESSAGE:
              this.signMessageMobile();
              return of(null);
            case MobileSolanaStates.GET_LICENSE:
              this.loading$.next(true);
              this.setBtnText(NftVerificationBtnStates.LICENSE_GETTING);
              return this.store.select(selectMobileSolanaWalletAddress).pipe(
                take(1),
                map((wallet) => ({ wallet, signature: data.data }))
              );
            default:
              return of(null);
          }
        }),
        filter(Boolean),
        switchMap(({ wallet, signature }) => {
          return this.verifService.getLicense(wallet, signature);
        }),
        finalize(() => {
          this.setBtnText(NftVerificationBtnStates.INITIAL);
          this.loading$.next(false);
        })
      )
      .subscribe({
        error: () => {},
      });
  }
}
