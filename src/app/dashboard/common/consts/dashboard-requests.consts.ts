import { HttpRequestData } from '@csd-services/http/http.models';

const enum HttpDashboardRequestNames {
  START_SUB = 'START_SUB',
}

export const DashboardRequests: Record<
  HttpDashboardRequestNames,
  HttpRequestData
> = {
  [HttpDashboardRequestNames.START_SUB]: {
    url: `/license/:param/subscription`,
    method: 'GET',
  },
};
