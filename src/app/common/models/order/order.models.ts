import { CryptoPaymentOptionDTO } from '@csd-modules/crypto-payment/models/crypto-payment.models';
import { UserDTO } from '../user.models';
import { PaymentCurrencies, PaymentWays } from './payment.models';

export interface OrderDTO {
  id: string;

  email: string;


  Receipt: Record<string, any>;
  description: string;

  currency: PaymentCurrencies;
  price: number;
  to_rub: number;

  payment_way: PaymentWays;
  tinkoff: { terminal_key: string };
  crypto: CryptoPaymentOptionDTO[];

  status: OrderStatuses;

  inviter: UserDTO | null;
}

const enum OrderStatuses {
  CREATED = 1,
  SUCCESS = 5,
}
