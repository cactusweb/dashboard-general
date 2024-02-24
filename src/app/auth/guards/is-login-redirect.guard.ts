import { isPlatformServer } from '@angular/common';
import { Injector, PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ACCESS_TOKEN_KEY } from '@csd-consts/auth.consts';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { AuthSuccess } from '@csd-store/auth/auth.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { AuthRedirectParam } from 'app/common/services/auth.service';

const REDIRECT_PARAM_KEY = 'redirect_to';

export const isLoginRedirectGuard: CanActivateFn = () => {
  if (isPlatformServer(inject(Injector).get(PLATFORM_ID))) {
    return true;
  }

  const queryParams = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const store = inject(Store<State>);
  const router = inject(Router);

  if (queryParams.get(ACCESS_TOKEN_KEY) && path === `/${RouterPaths.LOGIN}`) {
    store.dispatch(new AuthSuccess(queryParams.get(ACCESS_TOKEN_KEY)!));
    const redirectParams = getRedirectData(queryParams.get(REDIRECT_PARAM_KEY));
    return router.navigate([redirectParams.link], {
      queryParams: redirectParams.queryParams,
    });
  }

  return true;
};

function getRedirectData(
  redirectToStringParam: string | null
): AuthRedirectParam {
  if (redirectToStringParam) {
    return JSON.parse(redirectToStringParam)[0];
  }

  return { link: RouterPaths.LICENSES, queryParams: {} };
}
