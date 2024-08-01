import { HttpRequestData } from '@csd-services/http/http.models';

export const GET_ABOUT: HttpRequestData = {
  url: '/owner/:param/about',
  method: 'GET',
};
