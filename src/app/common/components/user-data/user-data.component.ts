import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgvarDirective } from '@csd-directives/ngvar.directive';
import { State } from '@csd-store/state';
import { selectUser } from '@csd-store/user/user.selectors';
import { distinctUntilChangedJSON } from '@csd-utils/distinct-until-changed-json.pipeline';
import { Store } from '@ngrx/store';

@Component({
  selector: 'csd-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  imports: [CommonModule, NgvarDirective],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDataComponent {
  readonly user$ = inject(Store<State>)
    .select(selectUser)
    .pipe(distinctUntilChangedJSON());
}
