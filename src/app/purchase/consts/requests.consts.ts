import { HttpRequestData } from '@csd-services/http/http.models';

const enum PurchaseHttpRequestsNames {
  AUTH_DROP = 'AUTH_DROP',
  AUTH_REFERRAL = 'AUTH_REFERRAL',
}

export const PurchaseRequests: Record<
  PurchaseHttpRequestsNames,
  HttpRequestData
> = {
  [PurchaseHttpRequestsNames.AUTH_DROP]: {
    url: '/drop/authenticate',
    method: 'POST',
  },
  [PurchaseHttpRequestsNames.AUTH_REFERRAL]: {
    url: '/referral/authenticate',
    method: 'POST',
  },
};
