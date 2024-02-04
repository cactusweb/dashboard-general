import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@csd-dashboard/common/components/confirm-dialog/confirm-dialog.component';
import { buildConfirmBtn } from '@csd-dashboard/common/components/confirm-dialog/helpers/confirm-dialog.helper';
import {
  ConfirmDialogBtnClasses,
  ConfirmDialogBtnColors,
  ConfirmDialogData,
  ConfirmDialogOptions,
} from '@csd-dashboard/common/components/confirm-dialog/models/confirm-dialog.model';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
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

  constructor(
    private dashService: DashboardService,
    private matDialog: MatDialog
  ) {}

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
    this.matDialog
      .open(ConfirmDialogComponent, {
        maxWidth: '500px',
        width: '100%',
        data: {
          leftBtn: buildConfirmBtn(
            'Unbind',
            ConfirmDialogBtnClasses.STROKED,
            ConfirmDialogBtnColors.WARN
          ),
          rightBtn: buildConfirmBtn(
            'Cancel',
            ConfirmDialogBtnClasses.FLAT,
            ConfirmDialogBtnColors.PRIMARY
          ),
          title: 'Are you sure?',
          description: 'After the unbind you will be excluded from the server',
        } as ConfirmDialogData,
      })
      .afterClosed()
      .subscribe((option) => {
        if (option === ConfirmDialogOptions.LEFT) {
          this.unbind();
        }
      });
  }

  private unbind() {
    this.unbindLoading$.next(true);
    this.dashService
      .unbind()
      .pipe(finalize(() => this.unbindLoading$.next(false)))
      .subscribe({
        error: () => {},
      });
  }
}
