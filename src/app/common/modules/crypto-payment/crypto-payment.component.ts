import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Requests } from '@csd-consts/requests.consts';
import { LicenseDTO } from '@csd-models/license.models';
import { OrderDTO } from '@csd-models/order/order.models';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { HttpService } from '@csd-services/http/http.service';
import { BehaviorSubject, finalize } from 'rxjs';

@Component({
  selector: 'csd-crypto-payment',
  templateUrl: './crypto-payment.component.html',
  styleUrls: ['./crypto-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsdCryptoPaymentComponent {
  @Input()
  order!: OrderDTO;

  @Input()
  @HostBinding('style.--primary-color')
  primaryColor: null | string = null;

  @Output()
  orderSuccess = new EventEmitter<any>();

  readonly form = new FormGroup({
    tx: new FormControl('', Validators.required),
    typeId: new FormControl('', Validators.required),
  });

  readonly loading$ = new BehaviorSubject(false);

  constructor(
    private snackbar: CsdSnackbarService,
    private http: HttpService
  ) {}

  get recipientAddress() {
    const typeId = this.form.get('typeId')!.value;
    return typeId
      ? this.order.crypto.find((opt) => opt.id === typeId)!.recipient
      : null;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.showWarnNotifications();
    if (this.form.invalid) {
      return;
    }

    const body = {
      email: '',
      crypto: this.form.value,
    };

    this.loading$.next(true);

    this.http
      .request<any>(Requests.PUT_ORDER_DATA, body, this.order.id)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (data) => this.orderSuccess.emit(data),
        error: () => {},
      });
  }

  private showWarnNotifications() {
    if (this.form.get('typeId')!.invalid)
      this.snackbar.createItem(
        'Choose the payment method',
        CsdSnackbarLevels.ERROR
      );

    if (this.form.get('tx')!.invalid)
      this.snackbar.createItem(
        'Input the transaction hash',
        CsdSnackbarLevels.ERROR
      );
  }
}
