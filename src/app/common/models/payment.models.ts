export interface LicensePaymentDTO {
  toRub: number;
  price: number;

  currency: string;

  email: string;

  last_4: string;
  exp_date: string;

  stripe_customer_created: boolean;

  way: PaymentWays;
}

export enum PaymentWays {
  TINKOFF = 'Tinkoff',
  NONE = '',
  AMERIA = 'AMERIA',
  CRYPTO = 'Crypto',
  STRIPE = 'Stripe',
}
