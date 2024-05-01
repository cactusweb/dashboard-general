import bs58 from 'bs58';
import nacl from 'tweetnacl';
import {
  CommonMethodParams,
  MobileSolanaMethods,
} from '../models/mobile-solana.models';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { selectMobileSolanaProvider } from 'app/nft-verification/common/store/mobile-solana.selectors';
import { map, take } from 'rxjs';
import { SolanaProvidersTypes } from '../../solana/solana.models';

const enum DeepLinkProviderLinks {
  PHANTOM = 'https://phantom.app/ul/v1',
  SOLFLARE = 'https://solflare.com/ul/v1',
}

const APP_URL = 'https://dashboard.cactusweb.io';

const DAPP_KEY_PAIR = nacl.box.keyPair.fromSecretKey(
  bs58.decode('14CgGMZirJogm7AkPgtTzZeEtpKHheKHhYt5BRfDFzF6')
);

/**
 * Шифрование DATA для выполнения метода
 * @param payload Данные запроса
 * @param encriptionPublicKey Сохраненный после Connect ключ
 * @returns Возвращает Nonce и Payload для выполнения метода
 */
function encryptPayload(
  payloadData: Record<string, string>,
  encriptionPublicKey: string
) {
  const sharedSecretDapp = nacl.box.before(
    bs58.decode(encriptionPublicKey!),
    DAPP_KEY_PAIR.secretKey
  );

  const nonce = nacl.randomBytes(24);

  const payload = bs58.encode(
    nacl.box.after(
      Buffer.from(JSON.stringify(payloadData)),
      nonce,
      sharedSecretDapp
    )
  );

  return { nonce: bs58.encode(nonce), payload };
}

function decryptMobileSolanaResponse<Data>(
  data: string,
  nonce: string,
  encriptionPublicKey: string
) {
  const sharedSecretDapp = nacl.box.before(
    bs58.decode(encriptionPublicKey!),
    DAPP_KEY_PAIR.secretKey
  );

  const decryptedData = nacl.box.open.after(
    bs58.decode(data),
    bs58.decode(nonce),
    sharedSecretDapp
  );
  if (!decryptedData) {
    throw new Error('Unable to decrypt data');
  }
  return JSON.parse(Buffer.from(decryptedData).toString('utf8')) as Data;
}

function useMobileSolanaMethod(
  method: MobileSolanaMethods,
  store: Store<State>,
  payload?: Record<string, any>,
  encriptionPublicKey?: string
) {
  const commonPayload: CommonMethodParams = {
    dapp_encryption_public_key: bs58.encode(DAPP_KEY_PAIR.publicKey),
    app_url: APP_URL,
    redirect_link: window.location.href + `/${method}`,
  };

  const params = new URLSearchParams({
    ...(payload ? encryptPayload(payload, encriptionPublicKey!) : {}),
    ...commonPayload,
  });

  store
    .select(selectMobileSolanaProvider)
    .pipe(
      take(1),
      map((provider) => {
        switch (provider) {
          case SolanaProvidersTypes.PHANTOM:
            return DeepLinkProviderLinks.PHANTOM;
          case SolanaProvidersTypes.SOLFLARE:
            return DeepLinkProviderLinks.SOLFLARE;
        }
      })
    )
    .subscribe((deepLinkPrefix) => {
      const url = `${deepLinkPrefix}/${method}?${params.toString()}`;
      window.open(url, '_blank', 'noopener');
      window.close();
    });
}

export { useMobileSolanaMethod, decryptMobileSolanaResponse };
