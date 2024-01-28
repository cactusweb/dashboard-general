import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DashboardService } from 'app/dashboard/services/dashboard.service';
import { BehaviorSubject, distinctUntilChanged, finalize, map } from 'rxjs';

@Component({
  selector: 'csd-dashboard-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionsComponent {
  readonly isUnbindable$ = this.dashService.license$.pipe(
    map((lic) => lic.unbindable),
    distinctUntilChanged()
  );
  readonly joinDsLoading$ = new BehaviorSubject(false);
  readonly unbindLoading$ = new BehaviorSubject(false);

  constructor(private dashService: DashboardService) {}

  onJoinDiscord() {
    this.joinDsLoading$.next(true);
    this.dashService
      .joinDiscord()
      .pipe(finalize(() => this.joinDsLoading$.next(false)))
      .subscribe({
        error: () => {},
      });
  }

  onUnbind() {
    this.unbindLoading$.next(true);
    this.dashService
      .unbind()
      .pipe(finalize(() => this.unbindLoading$.next(false)))
      .subscribe({
        error: () => {},
      });
  }
}
