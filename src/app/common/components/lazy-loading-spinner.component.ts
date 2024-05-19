import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'csd-lazy-loading-spinner',
  template: `
    <mat-progress-bar *ngIf="show()" mode="indeterminate" color="primary" />
  `,
  imports: [MatProgressBarModule, CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadingSpinnerComponent {
  readonly show = signal(false);
  readonly #destroyRef = inject(DestroyRef);

  constructor(private router: Router, private snackbar: CsdSnackbarService) {
    this.listenRouteLoading();
  }

  listenRouteLoading() {
    this.router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.show.set(true);
        } else if (this.show() == false) {
          return;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.show.set(false);
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
