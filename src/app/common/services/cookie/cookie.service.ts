import { Inject, Injectable } from '@angular/core';
import { CookieClientService } from './cookie-client.service';
import { CookieServerService } from './cookie-server.service';
import { COOKIE } from './cookie.consts';

@Injectable()
export class CookieService {
  constructor(
    @Inject(COOKIE)
    private cookie: CookieClientService | CookieServerService
  ) {}

  get(key: string) {
    return this.cookie.get(key);
  }

  set(key: string, value: string) {
    this.cookie.set(key, value);
  }

  delete(key: string) {
    this.cookie.delete(key);
  }
}
