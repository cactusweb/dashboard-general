import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
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
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    NgVarDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    private dialogData: {
      order: OrderDTO;
      email?: string;
    }
  ) {
    this.loading$ = combineLatest([
      this._loading$,
      this.orderService.loading$,
    ]).pipe(
      map(([loadingInner, loadingOrder]) => loadingOrder || loadingInner),
      distinctUntilChanged()
    );

    this.form.get('email')!.patchValue(this.dialogData.email || '');
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    this._loading$.next(true);

    this.orderService
      .postOrderData(this.form.value, this.dialogData.order)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe({
        error: () => {},
      });
  }
}
