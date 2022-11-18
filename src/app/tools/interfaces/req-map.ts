export type ReqMap = Record<string, Req> 

export interface Req{
    url: string,
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    authType?: null
}