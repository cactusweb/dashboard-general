import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { GetLicenses } from '@csd-store/licenses/licenses.actions';
import {
  selectLicenses,
  selectLicensesState,
} from '@csd-store/licenses/licenses.selectors';
import { State } from '@csd-store/state';
import { distinctUntilChangedJSON } from '@csd-utils/distinct-until-changed-json.pipeline';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';

enum PageStates {
  PENDING = 'pending',
  EMPTY = 'empty',
  VIEW = 'view',
}

@Component({
  selector: 'csd-licenses-list',
  templateUrl: './licenses-list.component.html',
  styleUrls: ['./licenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicensesListComponent implements OnInit {
  readonly licenses$ = this.store
    .select(selectLicenses)
    .pipe(distinctUntilChangedJSON());

  readonly state$ = this.store.select(selectLicensesState).pipe(
    map((state) => {
      if (state.pending && !state.data) {
        return PageStates.PENDING;
      }
      if (state.data!.licenses.length) {
        return PageStates.VIEW;
      }
      return PageStates.EMPTY;
    })
  );

  readonly PageStates = PageStates;

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.store.dispatch(new GetLicenses());
  }

  getPathToDash(ownerName: string) {
    return (
      '/' +
      RouterPaths.DASHBOARD.replace(
        ':owner_name',
        ownerName.split(' ').join('-')
      )
    );
  }
}
