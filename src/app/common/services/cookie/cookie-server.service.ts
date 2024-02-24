import { Inject, Injectable } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import { getParsedCookies } from './cookie.helper';
import * as dateFns from 'date-fns';

@Injectable()
export class CookieServerService {
  private cookieStore!: Record<string, string>;

  constructor(
    @Inject(REQUEST) private request: Request,
    @Inject(RESPONSE) private response: Response
  ) {
    this.parseCookie();
  }

  get(key: string) {
    return !!this.cookieStore[key] ? this.cookieStore[key] : null;
  }

  set(key: string, value: string) {
    this.response.cookie(key, value, {
      expires: dateFns.addMonths(new Date(), 1),
    });
  }

  delete(key: string) {
    this.response.cookie(key, null, {
      expires: new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
    });
  }

  parseCookie() {
    this.cookieStore = getParsedCookies(this.request.headers.cookie || '');
  }
}
