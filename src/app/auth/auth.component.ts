import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, AuthSuccess } from '@csd-store/auth/auth.actions';
import { selectAuthToken } from '@csd-store/auth/auth.selectors';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { RouterPaths } from 'app/common/consts/router-paths.conts';
import { AuthRedirectParam } from 'app/common/services/auth.service';

@Component({
  selector: 'csd-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  constructor(
    private store: Store<State>,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  onAuth() {
    this.store.dispatch(new Auth({ link: RouterPaths.LICENSES }));
  }

  ngOnInit(): void {
    // this.processAccessToken();
  }
  private processAccessToken() {
    const queryParams = this.activatedRoute.snapshot.queryParams;

    if (!queryParams['accessToken']) {
      return;
    }
    this.store.select(selectAuthToken).subscribe((res) => console.log(res));

    setTimeout(() => {
      this.store.dispatch(new AuthSuccess(queryParams['accessToken']));
      const redirectData = this.getRedirectData(queryParams['redirect_to']);
      console.log(redirectData, queryParams['accessToken']);
    }, 2400);
    // this.router.navigate([redirectData.link], {
    //   queryParams: redirectData.queryParams,
    // });
  }

  private getRedirectData(redirectToStringParam?: string): AuthRedirectParam {
    if (redirectToStringParam) {
      return JSON.parse(redirectToStringParam)[0];
    }

    return { link: RouterPaths.LICENSES, queryParams: {} };
  }
}
