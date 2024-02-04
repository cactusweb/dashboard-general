import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { PaymentStripeService } from './services/payment-stripe.service';
import { map } from 'rxjs';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';

@Component({
  selector: 'csd-payment-stripe',
  templateUrl: './payment-stripe.component.html',
  styleUrls: ['./payment-stripe.component.scss'],
  providers: [PaymentStripeService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentStripeComponent {
  @Input()
  disabled!: boolean;

  readonly hasPortal$ = inject(DashboardService).license$.pipe(
    map((lic) => lic.payment.stripe_customer_created)
  );

  readonly loading$ = this.stripeService.loading$;

  constructor(private stripeService: PaymentStripeService) {}

  onCreatePortal() {
    this.stripeService.createPortal();
  }

  onGoToPortal() {
    this.stripeService.goToPortal();
  }
}
