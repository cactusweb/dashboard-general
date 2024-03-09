import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ACCESS_TOKEN_KEY } from '@csd-consts/auth.consts';
import { CookieService } from '@csd-services/cookie/cookie.service';
import { SeoService } from '@csd-services/seo.service';
import { AuthSuccess } from '@csd-store/auth/auth.actions';
import { selectLicenses } from '@csd-store/licenses/licenses.selectors';
import { State } from '@csd-store/state';
import { selectUser } from '@csd-store/user/user.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'csd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    reg: MatIconRegistry,
    private cookie: CookieService,
    private seo: SeoService
  ) {
    reg.registerFontClassAlias('Font Icons', 'fi');
    reg.setDefaultFontSetClass('fi');

    const authToken = cookie.get(ACCESS_TOKEN_KEY);
    if (authToken) {
      inject(Store<State>).dispatch(new AuthSuccess(authToken));
    }
  }

  ngOnInit(): void {
    this.seo.startMetaAutoChanger();
  }
}
