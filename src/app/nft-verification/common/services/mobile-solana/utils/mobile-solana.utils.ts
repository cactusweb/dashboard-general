import bs58 from 'bs58';
import nacl from 'tweetnacl';
import {
  CommonMethodParams,
  MobileSolanaMethods,
} from '../models/mobile-solana.models';

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

  const url = `https://phantom.app/ul/v1/${method}?${params.toString()}`;
  window.open(url, '_self');
}

export { useMobileSolanaMethod, decryptMobileSolanaResponse };
