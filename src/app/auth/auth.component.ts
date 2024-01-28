import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { Auth } from '@csd-store/auth/auth.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '@csd-services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'csd-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [CommonModule, MatIconModule, MatProgressSpinnerModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  readonly authPending$ = inject(AuthService).pending$;

  constructor(private store: Store<State>) {}

  onAuth() {
    this.store.dispatch(new Auth({ link: RouterPaths.LICENSES }));
  }
}
