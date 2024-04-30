import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  CommonErrorResonse,
  CommonSuccessResponse,
  MobileSolanaMethods,
  MobileSolanaStates,
} from './models/mobile-solana.models';
import {
  decryptMobileSolanaResponse,
  useMobileSolanaMethod,
} from './utils/mobile-solana.utils';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import {
  MOBILE_SOLANA_STATE_KEY,
  MobileSolanaState,
  selectMobileSolanaEncryptionPublicKey,
  selectMobileSolanaSession,
} from '../../store/mobile-solana.selectors';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  shareReplay,
  take,
} from 'rxjs';
import { DisconnectPayload } from './models/mobile-solana-disconnect.models';
import {
  SignMessageDecryptedData,
  SignMessagePayload,
} from './models/mobile-solana-sign-message.models';
import { ActivatedRoute, Router } from '@angular/router';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import {
  ConnectionDataDecripted,
  ConnectionSuccessResponse,
} from './models/mobile-solana-connect.models';
import { SolanaProvidersTypes } from '../solana/solana.models';
import {
  MobileSolanaOnConnect,
  MobileSolanaOnDisconnect,
} from '../../store/mobile-solana.actions';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class CsdMobileSolanaService {
  readonly #state$ = new BehaviorSubject({
    state: MobileSolanaStates.DEFAULT,
    data: '',
  });

  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snbar: CsdSnackbarService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    if (isPlatformBrowser(platformId)) {
      this.checkAndSetState();
      this.checkMethodResponse();
    }
  }

  get state$() {
    return this.#state$.asObservable().pipe(shareReplay());
  }

  connect() {
    try {
      useMobileSolanaMethod(MobileSolanaMethods.CONNECT);
    } catch (e) {
      this.snbar.createItem(String(e), CsdSnackbarLevels.INFO);
    }
  }

  disconnect() {
    this.getCommonData().subscribe(([session, pubKey]) => {
      const payload: DisconnectPayload = { session };
      useMobileSolanaMethod(MobileSolanaMethods.DISCONNECT, payload, pubKey);
    });
  }

  signMessage(nonce: string) {
    this.getCommonData().subscribe(([session, pubKey]) => {
      const payload: SignMessagePayload = { session, message: nonce };
      useMobileSolanaMethod(MobileSolanaMethods.SIGN_MESSAGE, payload, pubKey);
    });
  }

  private getCommonData() {
    return combineLatest([
      this.store.select(selectMobileSolanaSession),
      this.store.select(selectMobileSolanaEncryptionPublicKey),
    ]).pipe(
      take(1),
      filter(([session, pubKey]) => Boolean(session && pubKey))
    );
  }

  private checkMethodResponse() {
    const method: MobileSolanaMethods | undefined =
      this.activatedRoute.snapshot.params['method'];
    if (!method) {
      return;
    }

    const response = this.activatedRoute.snapshot
      .queryParams as CommonErrorResonse & CommonSuccessResponse;

    if (response.errorMessage) {
      this.snbar.createItem(response.errorMessage, CsdSnackbarLevels.ERROR);
      this.redirectToVerifRoot();
      return;
    }

    switch (method) {
      case MobileSolanaMethods.CONNECT:
        this.handleConnect();
        break;
      case MobileSolanaMethods.DISCONNECT:
        this.handleDisconnect();
        this.redirectToVerifRoot();
        break;
      case MobileSolanaMethods.SIGN_MESSAGE:
        this.handleSignMessage();
        break;
      default:
        this.redirectToVerifRoot();
    }
  }

  private handleConnect() {
    const response = this.activatedRoute.snapshot
      .queryParams as ConnectionSuccessResponse;
    let encryptionPublicKey: string;
    let walletProvider: SolanaProvidersTypes;

    if (response.phantom_encryption_public_key) {
      encryptionPublicKey = response.phantom_encryption_public_key;
      walletProvider = SolanaProvidersTypes.PHANTOM;
    } else {
      encryptionPublicKey = response.solflare_encryption_public_key;
      walletProvider = SolanaProvidersTypes.SOLFLARE;
    }

    const data = decryptMobileSolanaResponse<ConnectionDataDecripted>(
      response.data,
      response.nonce,
      encryptionPublicKey
    );

    this.store.dispatch(
      new MobileSolanaOnConnect({
        walletProvider,
        publicKey: data.public_key,
        session: data.session,
        encryptionPublicKey,
      })
    );
    this.redirectToVerifRoot();
    this.#state$.next({ state: MobileSolanaStates.SIGN_MESSAGE, data: '' });
  }

  private handleDisconnect() {
    this.store.dispatch(new MobileSolanaOnDisconnect());
    this.redirectToVerifRoot();
  }

  private handleSignMessage() {
    const response = this.activatedRoute.snapshot
      .queryParams as CommonSuccessResponse;

    this.store
      .select(selectMobileSolanaEncryptionPublicKey)
      .pipe(take(1))
      .subscribe((key) => {
        const data = decryptMobileSolanaResponse<SignMessageDecryptedData>(
          response.data,
          response.nonce,
          key!
        );

        this.redirectToVerifRoot();

        this.#state$.next({
          state: MobileSolanaStates.SIGN_MESSAGE,
          data: data.signature,
        });
      });
  }

  private redirectToVerifRoot() {
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
      queryParams: {},
    });
  }

  private checkAndSetState() {
    const val = localStorage.getItem(MOBILE_SOLANA_STATE_KEY);
    if (!val) {
      return;
    }
    try {
      const state = JSON.parse(val) as MobileSolanaState;
      if (!state) {
        return;
      }
      this.store.dispatch(new MobileSolanaOnConnect(state));
    } catch {}
  }
}
