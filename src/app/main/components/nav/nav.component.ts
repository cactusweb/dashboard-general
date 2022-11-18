import { Component, HostBinding, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  authState!: Observable<boolean>;
  siteUrl = environment.siteUrl

  constructor(
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.authState = this.auth.getState()
  }

  @HostBinding('class.window') someField: boolean = true;

}
