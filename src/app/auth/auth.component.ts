import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { Auth } from '@csd-store/auth/auth.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'csd-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  constructor(private store: Store<State>) {}

  onAuth() {
    this.store.dispatch(new Auth({ link: RouterPaths.LICENSES }));
  }
}
