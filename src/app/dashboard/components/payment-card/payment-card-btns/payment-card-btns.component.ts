import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { BehaviorSubject, finalize, map } from 'rxjs';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { PaymentCardService } from '../services/payment-card.service';

@Component({
  selector: 'csd-payment-card-btns',
  templateUrl: './payment-card-btns.component.html',
  styleUrls: ['./payment-card-btns.component.scss'],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCardBtnsComponent {
  @Input()
  disabled!: boolean;

  readonly isCardLinked$ = this.dashService.license$.pipe(
    map((lic) => !!lic.payment.last_4)
  );

  readonly activateLoading$ = this.paymentService.activateLoading$;
  readonly renewLoading$ = this.paymentService.renewLoading$;
  readonly cancelLoading$ = new BehaviorSubject(false);

  constructor(
    private dashService: DashboardService,
    private paymentService: PaymentCardService,
    private snackbarService: CsdSnackbarService
  ) {}

  onActivate() {
    this.paymentService.linkCard();
  }

  onRenewNow() {
    this.paymentService.renewNow();
  }

  onCancel() {
    this.cancelLoading$.next(true);
    this.paymentService
      .cancelSub()
      .pipe(finalize(() => this.cancelLoading$.next(false)))
      .subscribe({
        next: () =>
          this.snackbarService.createItem(
            'Subscription cancelled',
            CsdSnackbarLevels.ERROR
          ),
        error: () => {},
      });
  }
}
