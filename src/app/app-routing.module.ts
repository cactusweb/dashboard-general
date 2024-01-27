import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterPaths } from './common/consts/router-paths.conts';
import { isAuthedGuard } from './auth/guards/is-authed.guard';
import { isLoginRedirectGuard } from './auth/guards/is-login-redirect.guard';

const routes: Routes = [
  {
    path: RouterPaths.AUTH,
    canMatch: [isLoginRedirectGuard],
    loadComponent: () =>
      import('./auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: RouterPaths.LOGIN,
    canMatch: [isLoginRedirectGuard],
    loadComponent: () =>
      import('./auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: '**',
    redirectTo: '/' + RouterPaths.AUTH,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
