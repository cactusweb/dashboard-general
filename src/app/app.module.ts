import { NgModule, inject, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from '@csd-store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthEffects } from '@csd-store/auth/auth.effects';
import { AppRoutingModule } from './app-routing.module';
import { NavDefaultComponent } from '@csd-components/nav-default/nav-default.component';
import { AuthTokenInterceptor } from '@csd-interceptors/auth-token.interceptor';
import { ErrorsHandlerInterceptor } from '@csd-interceptors/errors-handler.interceptor';
import { UserEffects } from '@csd-store/user/user.effects';
import { CsdSnackbarModule } from '@csd-modules/snackbar/snackbar.module';
import { LicensesEffects } from '@csd-store/licenses/licenses.effects';
import { LazyLoadingSpinnerComponent } from '@csd-components/lazy-loading-spinner.component';
import { FooterComponent } from '@csd-components/footer/footer.component';
import { DOCUMENT } from '@angular/common';
import { COOKIE } from '@csd-services/cookie/cookie.consts';
import { CookieClientService } from '@csd-services/cookie/cookie-client.service';
import { CookieService } from '@csd-services/cookie/cookie.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AppRoutingModule,

    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([AuthEffects, UserEffects, LicensesEffects]),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),

    CsdSnackbarModule,
    NavDefaultComponent,
    LazyLoadingSpinnerComponent,
    FooterComponent,
  ],
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsHandlerInterceptor,
      multi: true,
    },
    CookieService,
    {
      provide: COOKIE,
      useClass: CookieClientService,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
