import { HttpRequestData } from '@csd-services/http/http.models';

const apiUrl = '/nft-verification';

const enum NftVerificationHttpRequestsNames {
  GET_STATUS = 'GET_STATUS',
  GET_NONCE = 'GET_NONCE',
  GET_LICENSE = 'GET_LICENSE',
}

export const NftVerificationRequests: Record<
  NftVerificationHttpRequestsNames,
  HttpRequestData
> = {
  [NftVerificationHttpRequestsNames.GET_STATUS]: {
    url: apiUrl + '/:param/status',
    method: 'GET',
    optional: true,
  },
  [NftVerificationHttpRequestsNames.GET_NONCE]: {
    url: apiUrl + '/nonce',
    method: 'POST',
  },
  [NftVerificationHttpRequestsNames.GET_LICENSE]: {
    url: apiUrl + '/:param/verify',
    method: 'POST',
  },
};
