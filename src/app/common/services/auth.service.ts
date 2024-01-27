import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  auth(redirectTo?: Record<string, any>) {
    window.location.href =
      environment.apiUrl +
      '/auth?redirect_to=' +
      JSON.stringify(redirectTo || this.getRedirectToParam());
  }

  getRedirectToParam() {
    let urlParams = this.router.parseUrl(this.router.url);
    let currentLink = urlParams.root.children['primary']
      ? urlParams.root.children['primary'].segments
          .map((it) => it.path)
          .join('/')
      : '';

    return {
      queryParams: urlParams.queryParams,
      link: `/${currentLink}`,
    };
  }
}
