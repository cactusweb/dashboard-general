import { HttpRequestData } from '../services/http/http.models';

const enum HttpRequestNames {
  GET_ME = 'GET_ME',
  GET_LICENSES = 'GET_LICENSES',
  BIND_LICENSE = 'BIND_LICENSES',
  RESET_ACTIVATIONS = 'RESET_ACTIVATIONS',
  JOIN_DISCORD = 'JOIN_DISCORD',
  UNBIND_LICENSE = 'UNBIND_LICENSE',
}

export const Requests: Record<HttpRequestNames, HttpRequestData> = {
  [HttpRequestNames.GET_ME]: {
    url: '/@me',
    method: 'GET',
  },

  [HttpRequestNames.GET_LICENSES]: { url: '/license', method: 'GET' },

  [HttpRequestNames.BIND_LICENSE]: { url: '/license/bind', method: 'POST' },

  [HttpRequestNames.RESET_ACTIVATIONS]: {
    url: '/license/:param/reset',
    method: 'GET',
  },

  [HttpRequestNames.JOIN_DISCORD]: {
    url: `/license/:param/join-server`,
    method: 'GET',
  },

  [HttpRequestNames.UNBIND_LICENSE]: {
    url: '/license/:param/unbind',
    method: 'GET',
  },
};
