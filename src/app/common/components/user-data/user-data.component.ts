import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { State } from '@csd-store/state';
import { GetUser } from '@csd-store/user/user.actions';
import { selectUser } from '@csd-store/user/user.selectors';
import { distinctUntilChangedJSON } from '@csd-utils/distinct-until-changed-json.pipeline';
import { Store } from '@ngrx/store';

@Component({
  selector: 'csd-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  imports: [CommonModule, NgVarDirective, RouterModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataComponent implements OnInit {
  readonly user$ = this.store
    .select(selectUser)
    .pipe(distinctUntilChangedJSON());

  readonly licensesPath = '/' + RouterPaths.LICENSES;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.store.dispatch(new GetUser());
  }
}
