import { Injectable } from '@angular/core';
import { getParsedCookies } from './cookie.helper';

@Injectable()
export class CookieClientService {
  private cookieStore!: Record<string, string>;

  constructor() {
    this.parseCookie();
  }

  get(key: string) {
    return this.cookieStore[key] || null;
  }

  set(key: string, value: string) {
    document.cookie = key + '=' + (value || '') + '; path=/';
    this.parseCookie();
  }

  delete(key: string) {
    document.cookie = key + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.parseCookie();
  }

  parseCookie() {
    this.cookieStore = getParsedCookies(document.cookie);
  }
}
