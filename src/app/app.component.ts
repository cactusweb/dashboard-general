import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { ACCESS_TOKEN_KEY } from '@csd-consts/auth.consts';
import { CookieService } from '@csd-services/cookie/cookie.service';
import { SeoService } from '@csd-services/seo.service';
import { AuthSuccess } from '@csd-store/auth/auth.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'csd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(reg: MatIconRegistry, private seo: SeoService) {
    reg.registerFontClassAlias('Font Icons', 'fi');
    reg.setDefaultFontSetClass('fi');

    const authToken = inject(CookieService).get(ACCESS_TOKEN_KEY);
    if (authToken) {
      inject(Store<State>).dispatch(new AuthSuccess(authToken));
    }
  }

  ngOnInit(): void {
    this.seo.startMetaAutoChanger();
  }
}
