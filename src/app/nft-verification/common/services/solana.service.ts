import { Injectable } from '@angular/core';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import base58 from 'bs58';
import { catchError, from, map, throwError } from 'rxjs';

interface SolanaProvider {
  signMessage: (msg: Uint8Array, encoding?: string) => Promise<SolanaSignedMsg>;
  connect: () => Promise<{ publicKey: SolanaPublicKey }>;
}

interface SolanaSignedMsg {
  signature: Uint8Array;
  publicKey: SolanaPublicKey;
}

interface SolanaPublicKey {
  toBase58: () => string;
}

@Injectable()
export class CsdSolanaService {
  constructor(private snackbar: CsdSnackbarService) {}

  signMessage(nonce: string) {
    let solana!: SolanaProvider;

    try {
      solana = this.getSolanaProvider();
    } catch (err) {
      return throwError(() => err);
    }

    return from(solana.signMessage(new TextEncoder().encode(nonce))).pipe(
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
    let solana!: SolanaProvider;

    try {
      solana = this.getSolanaProvider();
    } catch (err) {
      return throwError(() => err);
    }

    return from(solana.connect()).pipe(
      map((d) => d.publicKey.toBase58()),
      catchError((err: Error) => {
        this.showSnackbarErr(err.message);
        return throwError(() => err);
      })
    );
  }

  private getSolanaProvider() {
    const solana: SolanaProvider | undefined = (window as any).solana;

    if (!solana) {
      const msg = 'Solana provider is not found. Try download Phantom.';
      this.showSnackbarErr(msg);
      throw new Error(msg);
    }

    return solana;
  }

  private showSnackbarErr(msg: string) {
    this.snackbar.createItem(msg, CsdSnackbarLevels.ERROR);
  }
}
