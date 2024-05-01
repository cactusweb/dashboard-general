import { Injectable } from '@angular/core';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import base58 from 'bs58';
import { catchError, from, map, throwError } from 'rxjs';
import {
  SolanaProvidersTypes,
  SolanaProvider,
  SolanaProvidersWindowNames,
} from './solana.models';

@Injectable()
export class CsdSolanaService {
  private provider!: SolanaProvider;

  constructor(private snackbar: CsdSnackbarService) {}

  selectProvider(providerType: SolanaProvidersTypes) {
    const windowProviderName = SolanaProvidersWindowNames[providerType];
    this.provider = (window as any)[windowProviderName];

    if (!this.provider) {
      const msg = 'Selected provider is not found.';
      this.showSnackbarErr(msg);
      throw new Error(msg);
    }
  }

  signMessage(nonce: string) {
    return from(
      this.provider.signMessage(new TextEncoder().encode(nonce))
    ).pipe(
      map(({ publicKey, signature }) => ({
        publicKey: publicKey.toBase58(),
        signature: base58.encode(signature),
      })),
      catchError((err: Error) => {
        this.showSnackbarErr(err.message);
        return throwError(() => err);
      })
    );
  }

  connect() {
    return from(this.provider.connect()).pipe(
      map((d) => this.provider.publicKey.toBase58()),
      catchError((err: Error) => {
        this.showSnackbarErr(err.message);
        return throwError(() => err);
      })
    );
  }

  private showSnackbarErr(msg: string) {
    this.snackbar.createItem(msg, CsdSnackbarLevels.ERROR);
  }
}
