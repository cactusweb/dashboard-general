import { Injectable } from '@angular/core';
import {
  CommonErrorResonse,
  CommonSuccessResponse,
  MobileSolanaMethods,
} from './models/mobile-solana.models';
import {
  decryptMobileSolanaResponse,
  useMobileSolanaMethod,
} from './utils/mobile-solana.utils';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import {
  selectMobileSolanaEncryptionPublicKey,
  selectMobileSolanaSession,
} from '../../store/mobile-solana.selectors';
import { combineLatest, filter, map, take } from 'rxjs';
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
import { MobileSolanaOnConnect } from '../../store/mobile-solana.actions';

const APP_URL = 'https://dashboard.cactusweb.io';

@Injectable()
export class CsdMobileSolanaService {
  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snbar: CsdSnackbarService
  ) {
    this.checkMethodResponse();
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
      // TODO redirect to root verification here
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
      // TODO redirect on root verification
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
  }

  private handleDisconnect() {}

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
      });
  }

  connect() {
    useMobileSolanaMethod(MobileSolanaMethods.CONNECT);
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

  private redirectToVerifRoot() {
    this.router.navigate(['../'], {
      relativeTo: this.activatedRoute,
      queryParamsHandling: 'merge',
    });
  }
}
