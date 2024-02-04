import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { BehaviorSubject, map } from 'rxjs';
import { PaymentCardService } from './services/payment-card.service';
import { CsdOrderService } from '@csd-services/order.service';

@Component({
  selector: 'csd-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
  providers: [PaymentCardService, CsdOrderService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCardComponent {
  @Input()
  disabled!: boolean;

  readonly cardNumber$ = inject(DashboardService).license$.pipe(
    map((lic) => {
      if (this.disabled || !lic.payment.last_4) {
        return null;
      }
      return `**** ${lic.payment.last_4}`;
    })
  );

  readonly loading$ = this.paymentService.activateLoading$;

  constructor(private paymentService: PaymentCardService) {}

  onChangeCard() {
    this.paymentService.linkCard();
  }
}
