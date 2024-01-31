import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import { CsdOrderService } from '@csd-services/order.service';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  finalize,
  map,
  switchMap,
  take,
} from 'rxjs';

@Component({
  selector: 'csd-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CsdOrderService],
})
export class PurchaseFormComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  readonly priceData$ = this.prchService.drop$.pipe(
    map((d) => ({ price: d.price, currency: d.currency }))
  );

  readonly loading$;

  private readonly _loading$ = new BehaviorSubject(false);

  constructor(
    private orderService: CsdOrderService,
    private prchService: PurchaseService
  ) {
    this.loading$ = combineLatest([
      this._loading$,
      this.orderService.loading$,
    ]).pipe(
      map(([loadingInner, loadingOrder]) => loadingOrder || loadingInner),
      distinctUntilChanged()
    );
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    this._loading$.next(true);

    this.prchService.drop$
      .pipe(
        take(1),
        switchMap((order) =>
          this.orderService.postOrderData(this.form.value, order)
        ),
        finalize(() => this._loading$.next(false))
      )
      .subscribe({
        error: () => {},
      });
  }
}
