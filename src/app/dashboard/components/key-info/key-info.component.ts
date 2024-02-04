import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { UtilsService } from '@csd-services/utils.service';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'csd-dashboard-key-info',
  templateUrl: './key-info.component.html',
  styleUrls: ['./key-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeyInfoComponent {
  readonly license$ = this.dashService.license$;
  readonly loading$ = new BehaviorSubject(false);

  constructor(
    private utilsService: UtilsService,
    private dashService: DashboardService
  ) {}

  onCopyKey(key: string) {
    this.utilsService.copy(key, true, 'License key copied!');
  }

  onResetActivations() {
    this.loading$.next(true);
    this.dashService
      .resetActivations()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({ error: () => {} });
  }
}
