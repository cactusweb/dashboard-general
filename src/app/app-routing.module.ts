import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsLogginedGuard } from "./auth/guards/is-loggined.guard";
import { NetworkAwarePreloadingServiceService } from "./tools/services/network-aware-preloading-service.service";

const routes: Routes = [
    { path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [IsLogginedGuard] },
    { path: 'licenses', loadChildren: () => import('./license-list/license-list.module').then(m => m.LicenseListModule) },
    { path: ':ownerName/dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
    { path: ':ownerName/purchase', loadChildren: () => import('./purchase/purchase.module').then(m => m.PurchaseModule) },
    { path: '**', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) }
]


@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: NetworkAwarePreloadingServiceService })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
  