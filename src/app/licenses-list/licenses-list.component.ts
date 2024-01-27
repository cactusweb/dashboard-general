import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'csd-licenses-list',
  templateUrl: './licenses-list.component.html',
  styleUrls: ['./licenses-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicensesListComponent {}
