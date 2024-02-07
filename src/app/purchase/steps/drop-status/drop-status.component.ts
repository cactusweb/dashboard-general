import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentWays } from '@csd-models/order/payment.models';
import { IPurchaseSteps } from '@csd-purchase/models/purchase.models';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import { Observable, catchError, map, of, take } from 'rxjs';

enum IDropStates {
  PENDING = 'PENDING',
  DISABLED = 'DISABLED',
  ACTIVE = 'ACTIVE',
}

@Component({
  selector: 'csd-drop-status',
  templateUrl: './drop-status.component.html',
  styleUrls: ['./drop-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropStatusComponent {
  readonly state$ = new Observable<IDropStates>((sub) => {
    sub.next(IDropStates.PENDING);

    this.prchService.drop$
      .pipe(
        take(1),
        map(() => IDropStates.ACTIVE),
        catchError(() => of(IDropStates.DISABLED))
      )
      .subscribe((res) => sub.next(res));
  });

  readonly priceData$ = this.prchService.drop$.pipe(
    map((d) => ({ price: d.price, currency: d.currency }))
  );

  readonly IDropStates = IDropStates;

  constructor(private prchService: PurchaseService) {}

  onPurchase() {
    this.prchService.drop$
      .pipe(
        take(1),
        map((d) => d.payment_way)
      )
      .subscribe((pWay) =>
        this.prchService.changeStep(
          pWay === PaymentWays.CRYPTO
            ? IPurchaseSteps.CRYPTO_PAYMENT
            : IPurchaseSteps.FORM
        )
      );
  }
}
