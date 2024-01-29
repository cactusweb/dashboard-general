import { ReqMap } from 'src/app/tools/interfaces/req-map';
import { environment } from 'src/environments/environment';

export const StripePaymentRequests: ReqMap = {
  getPortalLink: {
    url: `/license/:param/stripe-portal`,
    method: 'GET',
  },

  getCustomerCreatingLink: {
    url: `/license/:param/stripe/subscribe`,
    method: 'GET',
  },
};
