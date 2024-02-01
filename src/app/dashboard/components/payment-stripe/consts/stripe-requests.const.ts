import { HttpRequestData } from '@csd-services/http/http.models';

export const enum HttpStripeRequestNames {
  CREATE_PORTAL = 'CREATE_PORTAL',
  GET_PORTAL = 'GET_PORTAL',
}

export const StripeRequests: Record<HttpStripeRequestNames, HttpRequestData> = {
  [HttpStripeRequestNames.GET_PORTAL]: {
    url: `/license/:param/stripe-portal`,
    method: 'GET',
  },

  [HttpStripeRequestNames.CREATE_PORTAL]: {
    url: `/license/:param/stripe/subscribe`,
    method: 'GET',
  },
};
