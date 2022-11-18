import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private $state: BehaviorSubject<boolean>;

  constructor(
    private router: Router
  ) {
    this.$state = new BehaviorSubject<boolean>(!!localStorage['accessToken'])
  }

  
  login( redirectParam?: any ){
    if (!redirectParam)
      redirectParam = this.getCurrentRoute();

    redirectParam = JSON.stringify(redirectParam);
    localStorage.removeItem('accessToken');
    window.location.href = `${this.apiUrl}/auth?redirect_to=${redirectParam}`;
  }
  
  logout(){
    localStorage.removeItem( 'accessToken' );
    this.$state.next(false);
    this.router.navigate(['/login'])
  }

  setAccessToken(token: string){
    localStorage['accessToken'] = token;
    this.$state.next(true)
  }

  
  private getCurrentRoute(){
    let urlParams = this.router.parseUrl(this.router.url)
    let currentLink = urlParams.root.children['primary'] ? 
      urlParams.root.children['primary'].segments.map(it => it.path).join('/')
      :
      ''

    return {
      queryParams: urlParams.queryParams,
      link: `/${currentLink}`,
    };
  }



  getState(){
    return this.$state.asObservable();
  }
}
