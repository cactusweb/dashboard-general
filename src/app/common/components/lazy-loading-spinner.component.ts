import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';

@Component({
  selector: 'csd-lazy-loading-spinner',
  template: `
    <mat-progress-bar
      *ngIf="show$ | async"
      mode="indeterminate"
      color="primary"
    ></mat-progress-bar>
  `,
  imports: [MatProgressBarModule, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadingSpinnerComponent {
  readonly show$ = new BehaviorSubject(false);
  private readonly destroyed$ = new Subject<void>();

  constructor(private router: Router, private snackbar: CsdSnackbarService) {
    this.listenRouteLoading();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  listenRouteLoading() {
    this.router.events.pipe(takeUntil(this.destroyed$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.show$.next(true);
      } else if (this.show$.value == false) {
        return;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.show$.next(false);
      }

      if (event instanceof NavigationError) {
        this.snackbar.createItem(
          'Failed to load page',
          CsdSnackbarLevels.ERROR
        );
      }
    });
  }
}
