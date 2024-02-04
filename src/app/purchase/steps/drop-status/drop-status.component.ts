import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PaymentWays } from '@csd-models/order/payment.models';
import { PurchaseSteps } from '@csd-purchase/models/purchase.models';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import {
  BehaviorSubject,
  Observable,
  catchError,
  concatMap,
  exhaustMap,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';

enum DropStates {
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
  readonly state$ = new Observable<DropStates>((sub) => {
    sub.next(DropStates.PENDING);

    this.prchService.drop$
      .pipe(
        take(1),
        map(() => DropStates.ACTIVE),
        catchError(() => of(DropStates.DISABLED))
      )
      .subscribe((res) => sub.next(res));
  });

  readonly priceData$ = this.prchService.drop$.pipe(
    map((d) => ({ price: d.price, currency: d.currency }))
  );

  readonly DropStates = DropStates;

  constructor(private prchService: PurchaseService) {}

  onPurchase() {
    this.prchService.drop$
      .pipe(map((d) => d.payment_way))
      .subscribe((pWay) =>
        this.prchService.changeStep(
          pWay === PaymentWays.CRYPTO
            ? PurchaseSteps.CRYPTO_PAYMENT
            : PurchaseSteps.FORM
        )
      );
  }
}