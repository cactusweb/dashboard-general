import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { StripePaymentService } from './services/stripe-payment.service';
import { finalize } from 'rxjs';
import { LicensePayment } from 'src/app/license-list/interfaces/license-payment';

@Component({
  selector: 'app-stripe-payment',
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StripePaymentComponent {
  @Input()
  paymentData!: LicensePayment;

  loading = false;

  readonly REFUND_LINK =
    'https://discord.com/channels/869225451439140885/1184140674010988655/1184141686104920185';

  constructor(
    private stripeService: StripePaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  createCustomer() {
    this.loading = true;

    this.stripeService
      .createCustomer()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({});
  }

  goToPortal() {
    this.loading = true;
    this.stripeService.goToPortal().subscribe({
      complete: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
