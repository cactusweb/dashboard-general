import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { LicenseTypes } from '@csd-models/license.models';
import { DashboardService } from 'app/dashboard/services/dashboard.service';
import { BehaviorSubject, map } from 'rxjs';

@Component({
  selector: 'csd-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss'],
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

  readonly loading$ = new BehaviorSubject(false);

  onChangeCard() {
    this.loading$.next(true);
  }
}
