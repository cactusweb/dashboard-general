export type req = {
    url: string,
    method: 'GET' | 'POST' | 'DELETE' | 'PUT'
};

type reqMap = Record< string, req >;

export const Requests: reqMap = {
    getUser: { url: `/@me`, method: 'GET' },

    getLicenses: { url: '/license', method: 'GET' },

    getLicense: { url: `/license/:param`, method: 'GET' },
    resetLicense: { url: `/license/:param/reset`, method: 'GET' },
    
    getDrop: { url: `/drop/authenticate`, method: 'POST' },
    purchaseFree: { url: `/drop/:param/free`, method: 'POST' },

    getReferral: { url: '/referral/authenticate', method: 'POST' },
    getReferralPrizes: { url: `/referral/:param`, method: 'GET' },


    joinServer: { url: `/license/:param/join-server`, method: 'GET' },

    bindLicense: { url: `/license/bind`, method: 'POST' },
    unbindLicense: { url: `/license/:param/unbind`, method: 'GET' },

    getOwner: { url: `/owner/:param`, method: 'GET' }
}