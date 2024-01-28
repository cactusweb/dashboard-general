import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserDataComponent } from '@csd-components/user-data/user-data.component';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { AuthLogout } from '@csd-store/auth/auth.actions';
import { selectIsAuthed } from '@csd-store/auth/auth.selectors';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'csd-nav-default',
  templateUrl: './nav-default.component.html',
  styleUrls: ['./nav-default.component.scss'],
  imports: [CommonModule, NgVarDirective, RouterModule, UserDataComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NavDefaultComponent {
  readonly isAuthed$ = this.store.select(selectIsAuthed);

  constructor(private store: Store<State>) {}

  onLogout() {
    this.store.dispatch(new AuthLogout(RouterPaths.AUTH));
  }
}
