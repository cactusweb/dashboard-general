import { HttpRequestData } from '@csd-services/http/http.models';

const enum HttpDashboardRequestNames {
  START_SUB = 'START_SUB',
  RENEW = 'RENEW',
  CANCEL_SUBSCRIPTION = 'CANCEL_SUBSCRIPTION',
}

export const DashboardRequests: Record<
  HttpDashboardRequestNames,
  HttpRequestData
> = {
  [HttpDashboardRequestNames.START_SUB]: {
    url: `/license/:param/subscription`,
    method: 'GET',
  },

  [HttpDashboardRequestNames.RENEW]: {
    url: `/license/:param/renew`,
    method: 'GET',
  },

  [HttpDashboardRequestNames.CANCEL_SUBSCRIPTION]: {
    url: `/license/:param/subscription`,
    method: 'DELETE',
  },
};
