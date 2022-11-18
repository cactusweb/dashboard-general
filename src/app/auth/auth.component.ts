import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

interface RedirectData{
  link: string,
  queryParams: Record<any,any>
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  loading: boolean = false;

  constructor(
    private auth: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.setAccessToken();
  }

  onLogin(){
    this.loading = true;
    this.auth.login({link: '/licenses'});
  }  

  setAccessToken(){
    let queryParams = this.activatedRoute.snapshot.queryParams;

    if ( !queryParams['accessToken'] ) return;

    this.auth.setAccessToken(queryParams['accessToken']);
    
    let redirectData: RedirectData = this.getRedirectData(queryParams)[0]
    this.router.navigate([redirectData.link], { queryParams: redirectData.queryParams });
  }

  getRedirectData( queryParams: Record<any,any> ): [RedirectData]{
    if ( queryParams['redirect_to'] )
      return JSON.parse(queryParams['redirect_to'])

    return [{ link: `/bind`, queryParams: {} }]
  }

}
