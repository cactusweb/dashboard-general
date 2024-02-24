import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { COOKIE } from '@csd-services/cookie/cookie.consts';
import { CookieServerService } from '@csd-services/cookie/cookie-server.service';
import { CookieService } from '@csd-services/cookie/cookie.service';
import { ServerModule } from '@angular/platform-server';
import { NgModule } from '@angular/core';

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
  providers: [
    CookieService,
    { provide: COOKIE, useClass: CookieServerService },
  ],
})
export class AppServerModule {}
