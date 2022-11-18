import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, EMPTY, Observable, throwError } from 'rxjs';
import { ToolsService } from './tools.service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable()
export class Interceptor implements HttpInterceptor {
  loading: boolean = false;

  constructor(
    private tools: ToolsService,
    private auth: AuthService,
    private notification: NotificationsService,
  ) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if ( !this.validateAuth() )
      return EMPTY;
    
    req = this.setAuthHeader(req);
    return next.handle(req)
      .pipe(
        catchError(err => {

          if ( err?.error?.message ) err.error.message = this.tools.capitalizeFirstLetter(err.error.message)

          if ( err.status == 0 ){
            err.message = "Connection timeout";
            this.tools.generateNotification('Connection timeout. Check you internet connection.')
          }else

          if ( err.status == 404 ) err.message = "Endpoint not found"; else

          if ( err.status == 401 ){
            this.auth.login();
            this.tools.generateNotification( 'Error 401: You are not authorized' )
          }else
          if ( err.status > 500 ){
            this.tools.generateNotification( `Error ${err.status}: Server is temporarily unavailable` );
            err.message = "Server is temporarily unavailable"
          }else
          if ( err.status >= 400 && err.status <= 500 && !this.isGetLicenseReq(req) )
            this.tools.generateNotification( `${err.error.message || err.error.error || err.message}` )

          return throwError(err)
        })
      )
  }

  isGetLicenseReq(req: HttpRequest<unknown>){
    return req.url.includes('license') && !req.url.includes('reset') && req.method == 'GET'
  }

  
  setAuthHeader( req: HttpRequest<unknown> ): HttpRequest<unknown>{
    return req.clone({ headers: req.headers.set('authorization', `Bearer ${localStorage['accessToken']}`) });
  }

  validateAuth(): boolean{
    if ( localStorage['accessToken'] ) return true

    if ( !this.loading ){
      this.loading = true;
      this.auth.login();
    }

    return false
  }
}
