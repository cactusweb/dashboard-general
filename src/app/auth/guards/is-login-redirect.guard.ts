import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { AuthSuccess } from '@csd-store/auth/auth.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { AuthRedirectParam } from 'app/common/services/auth.service';

const ACCESS_TOKEN_KEY = 'accessToken';
const REDIRECT_PARAM_KEY = 'redirect_to';

export function isLoginRedirectGuard(): boolean {
  const queryParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const store = inject(Store<State>);
  const router = inject(Router);

  if (queryParams.get(ACCESS_TOKEN_KEY) && path === `/${RouterPaths.LOGIN}`) {
    store.dispatch(new AuthSuccess(queryParams.get(ACCESS_TOKEN_KEY)!));
    const redirectParams = getRedirectData(queryParams.get(REDIRECT_PARAM_KEY));

    router.navigate([redirectParams.link], {
      queryParams: redirectParams.queryParams,
    });

    return false;
  }

  return true;
}

function getRedirectData(
  redirectToStringParam: string | null
): AuthRedirectParam {
  if (redirectToStringParam) {
    return JSON.parse(redirectToStringParam)[0];
  }

  return { link: RouterPaths.LICENSES, queryParams: {} };
}
