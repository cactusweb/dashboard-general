import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { isAuthedGuard } from '@csd-auth/guards/is-authed.guard';
import { isLoginRedirectGuard } from '@csd-auth/guards/is-login-redirect.guard';
import { RouterPaths } from '@csd-consts/router-paths.conts';

const titlePostfix = '| CactusDash';

const routes: Routes = [
  {
    path: RouterPaths.AUTH,
    canMatch: [isAuthedGuard, isLoginRedirectGuard],
    title: `Authorization ${titlePostfix}`,
    loadComponent: () =>
      import('./auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: RouterPaths.LOGIN,
    canMatch: [isAuthedGuard, isLoginRedirectGuard],
    title: `Authorization ${titlePostfix}`,
    loadComponent: () =>
      import('./auth/auth.component').then((c) => c.AuthComponent),
  },
  {
    path: RouterPaths.MEMBERSHIPS,
    title: `Memberships ${titlePostfix}`,
    loadChildren: () =>
      import('./licenses-list/licenses-list.module').then(
        (m) => m.LicensesListModule
      ),
  },
  {
    path: RouterPaths.LICENSES,
    redirectTo: RouterPaths.MEMBERSHIPS,
  },
  {
    path: RouterPaths.DASHBOARD,
    title: `Dashboard ${titlePostfix}`,
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: RouterPaths.PURCHASE,
    title: `Purchase ${titlePostfix}`,
    loadChildren: () =>
      import('./purchase/purchase.module').then((m) => m.PurchaseModule),
  },
  {
    path: RouterPaths.NFT_VERIFICATION,
    title: `NFT Verification ${titlePostfix}`,
    loadComponent: () =>
      import('./nft-verification/nft-verification.component').then(
        (m) => m.NftVerificationComponent
      ),
  },

  {
    path: RouterPaths.NFT_VERIFICATION + '/:method',
    title: `NFT Verification ${titlePostfix}`,
    loadComponent: () =>
      import('./nft-verification/nft-verification.component').then(
        (m) => m.NftVerificationComponent
      ),
  },

  {
    path: 'main',
    redirectTo: RouterPaths.LICENSES,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: RouterPaths.LICENSES,
  },
  {
    path: '**',
    title: `Not found ${titlePostfix}`,
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (c) => c.NotFoundComponent
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
