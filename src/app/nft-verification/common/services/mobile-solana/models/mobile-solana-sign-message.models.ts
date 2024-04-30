export interface SignMessagePayload {
  message: string;
  session: string;
}

export interface SignMessageDecryptedData {
  signature: string;
}
