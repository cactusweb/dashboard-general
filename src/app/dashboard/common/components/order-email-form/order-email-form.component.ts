import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDTO } from '@csd-models/order/order.models';
import { CsdOrderService } from '@csd-services/order.service';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  finalize,
  map,
} from 'rxjs';

@Component({
  selector: 'csd-order-email-form',
  templateUrl: './order-email-form.component.html',
  providers: [CsdOrderService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderEmailFormComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  readonly loading$;

  private readonly _loading$ = new BehaviorSubject(false);

  constructor(
    private orderService: CsdOrderService,
    @Inject(MAT_DIALOG_DATA)
    private order: OrderDTO
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

    this.orderService
      .postOrderData(this.form.value, this.order)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe({
        error: () => {},
      });
  }
}
