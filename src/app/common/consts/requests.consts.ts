import { HttpRequestData } from '../services/http/http.models';

const enum HttpRequestNames {
  GET_ME = 'GET_ME',
  GET_LICENSES = 'GET_LICENSES',
  BIND_LICENSE = 'BIND_LICENSES',
}

export const Requests: Record<HttpRequestNames, HttpRequestData> = {
  [HttpRequestNames.GET_ME]: {
    url: '/@me',
    method: 'GET',
  },
  [HttpRequestNames.GET_LICENSES]: { url: '/license', method: 'GET' },
  [HttpRequestNames.BIND_LICENSE]: { url: '/license/bind', method: 'POST' },
};
