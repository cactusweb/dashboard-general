export interface CryptoPaymentOptionDTO extends CryptoPaymentCoinDataDTO {
  id: string;
  amount: number;
  recipient: string;
}

interface CryptoPaymentCoinDataDTO {
  network: string;
  coin: {
    fullname: string;
    image: string;
    name: string;
  };
}
