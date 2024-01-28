import { HttpRequestData } from '../services/http/http.models';

export const enum HttpRequestNames {
  GET_ME = 'GET_ME',
  GET_LICENSES = 'GET_LICENSES',
}

export const Requests: Record<HttpRequestNames, HttpRequestData> = {
  [HttpRequestNames.GET_ME]: {
    url: '/@me',
    method: 'GET',
  },
  [HttpRequestNames.GET_LICENSES]: { url: '/license', method: 'GET' },
};
