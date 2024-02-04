import { PaymentWays } from './order/payment.models';
import { OwnerDTO } from './owner.models';
import { LicenseReferralDTO } from './referral.models';

export interface LicenseDTO {
  id: string;
  unbindable: boolean;
  activations: LicenseActivationsDTO;
  expires_in: number | null;
  type: LicenseTypes;
  key: string;
  created_at: number;
  bought_at: number;
  description: string;

  owner: OwnerDTO;
  payment: LicensePaymentDTO;
  referral: LicenseReferralDTO | null;
}

export interface LicenseActivationsDTO {
  quantity: number;
  devices: string[];
}

export enum LicenseTypes {
  RENEWAL = 'renewal',
  LIFETIME = 'lifetime',
  TRIAL = 'trial',
  TRIAL_RENEWAL = 'trial-renewal',
}

export interface LicensePaymentDTO {
  toRub: number;
  price: number;

  currency: string;

  email?: string;

  last_4?: string;
  exp_date?: string;

  stripe_customer_created: boolean;

  way: PaymentWays;
}
