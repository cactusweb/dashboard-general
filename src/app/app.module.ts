import { NgModule, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from '@csd-store/reducers';
import { storageMetaReducer } from '@csd-store/storage.meta-reducer';
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AppRoutingModule,

    //@ts-ignore
    StoreModule.forRoot(reducers, { metaReducers: [storageMetaReducer] }),
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
  ],
  providers: [
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
