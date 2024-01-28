import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthedGuard } from '@csd-auth/guards/is-authed.guard';
import { isLoginRedirectGuard } from '@csd-auth/guards/is-login-redirect.guard';
import { RouterPaths } from '@csd-consts/router-paths.conts';

const routes: Routes = [
  {
    path: RouterPaths.AUTH,
    canMatch: [isAuthedGuard, isLoginRedirectGuard],
    loadComponent: () =>
      import('./auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: RouterPaths.LOGIN,
    canMatch: [isAuthedGuard, isLoginRedirectGuard],
    loadComponent: () =>
      import('./auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: RouterPaths.LICENSES,
    loadChildren: () =>
      import('./licenses-list/licenses-list.module').then(
        (m) => m.LicensesListModule
      ),
  },
  {
    path: RouterPaths.DASHBOARD,
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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
