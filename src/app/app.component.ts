import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { selectIsAuthed } from '@csd-store/auth/auth.selectors';
import { distinctUntilChanged, filter } from 'rxjs';
import { GetUser } from '@csd-store/user/user.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(reg: MatIconRegistry, private store: Store<State>) {
    reg.registerFontClassAlias('Font Icons', 'fi');
    reg.setDefaultFontSetClass('fi');
  }

  ngOnInit(): void {
    this.store
      .select(selectIsAuthed)
      .pipe(
        distinctUntilChanged(),
        filter((authed) => authed)
      )
      .subscribe(() => {
        this.store.dispatch(new GetUser());
      });
  }
}
