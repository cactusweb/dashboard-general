import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PaymentWays } from '@csd-models/order/payment.models';
import { DashboardService } from 'app/dashboard/services/dashboard.service';
import { map } from 'rxjs';

@Component({
  selector: 'csd-dashboard-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentInfoComponent {
  readonly paymentWay$ = inject(DashboardService).license$.pipe(
    map((lic) => lic.payment.way)
  );

  readonly PaymentWays = PaymentWays;
}
