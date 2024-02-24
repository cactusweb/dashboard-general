import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { AuthLogout } from '@csd-store/auth/auth.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { environment } from 'environment/environment';
import { BehaviorSubject, shareReplay } from 'rxjs';

export interface AuthRedirectParam {
  link: string;
  queryParams?: Record<string, any>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _pending$ = new BehaviorSubject(false);
  readonly pending$ = this._pending$.asObservable().pipe(shareReplay());

  constructor(private router: Router, private store: Store<State>) {}

  auth(redirectTo?: AuthRedirectParam) {
    this._pending$.next(true);
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
    } as AuthRedirectParam;
  }

  logout() {
    this.store.dispatch(new AuthLogout(RouterPaths.AUTH));
  }
}
