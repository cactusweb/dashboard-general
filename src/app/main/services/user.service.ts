import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, take, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Requests } from 'src/app/const';
import { User } from '../../tools/interfaces/user';
import { HttpService } from '../../tools/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: User|null = null;
  private set user(val: User|null){
    this._user = val;
    this.$user.next(val)
  }
  private get user(): User|null{
    return this._user;
  }

  private $user = new BehaviorSubject<User|null>(null);

  constructor(
    private http: HttpService,
    private auth: AuthService
  ) { 
    this.auth.getState()
      .pipe(filter(s => !s))
      .subscribe(res => this.user = null)
  }

  getUser(){
    if ( !this.user )
      this.fetchUser();

    return this.$user.asObservable();
  }

  private fetchUser(){
    this.http.request(Requests['getUser'])
      .pipe(take(1))
      .subscribe({
        next: v => this.user = v,
        error: e => {}
      })
  }

}
