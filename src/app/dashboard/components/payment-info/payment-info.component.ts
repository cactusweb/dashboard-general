import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { LicenseTypes } from '@csd-models/license.models';
import { PaymentWays } from '@csd-models/order/payment.models';
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

  readonly paymentDisabled$ = inject(DashboardService).license$.pipe(
    map(
      (lic) =>
        lic.payment.way === PaymentWays.NONE ||
        [LicenseTypes.LIFETIME, LicenseTypes.TRIAL].includes(lic.type)
    )
  );

  readonly PaymentWays = PaymentWays;
}
