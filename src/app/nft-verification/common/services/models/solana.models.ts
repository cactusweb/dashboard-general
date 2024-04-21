export enum SolanaProvidersTypes {
  PHANTOM = 'PHANTOM',
  SOLFLARE = 'SOLFLARE',
}

export enum SolanaProvidersWindowNames {
  PHANTOM = 'solana',
  SOLFLARE = 'solflare',
}

export interface SolanaProvider {
  signMessage: (msg: Uint8Array, encoding?: string) => Promise<SolanaSignedMsg>;
  connect: () => Promise<{ publicKey: SolanaPublicKey }>;
  publicKey: SolanaPublicKey,
}

interface SolanaSignedMsg {
  signature: Uint8Array;
  publicKey: SolanaPublicKey;
}

interface SolanaPublicKey {
  toBase58: () => string;
}
