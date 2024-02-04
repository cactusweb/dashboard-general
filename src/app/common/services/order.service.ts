import { Injectable } from '@angular/core';
import { HttpService } from './http/http.service';
import { Requests } from '@csd-consts/requests.consts';
import {
  BehaviorSubject,
  catchError,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { OrderDTO } from '@csd-models/order/order.models';
import { PaymentWays } from '@csd-models/order/payment.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';

interface OrderDataDTO {
  payment_url: string;
}

@Injectable()
export class CsdOrderService {
  readonly loading$;

  private readonly _loading$ = new BehaviorSubject(false);

  private order!: OrderDTO;

  constructor(private http: HttpService, private snackbar: CsdSnackbarService) {
    this.loading$ = this._loading$.asObservable().pipe(shareReplay());
  }

  postOrderData(orderData: Record<string, any>, order: OrderDTO) {
    this.order = order;

    this._loading$.next(true);

    return this.http
      .request<OrderDataDTO | undefined>(
        Requests.PUT_ORDER_DATA,
        orderData,
        order.id
      )
      .pipe(
        tap((d) => this.handleOrder(d)),
        catchError((err) => {
          this._loading$.next(false);
          return throwError(() => err);
        })
      );
  }

  private handleOrder(data: OrderDataDTO | undefined) {
    if (!data) {
      this._loading$.next(false);
      return;
    }

    switch (this.order.payment_way) {
      case PaymentWays.AMERIA:
      case PaymentWays.STRIPE:
        this._loading$.next(true);
        window.location.href = data.payment_url;
        break;
      case PaymentWays.TINKOFF:
        const msg = 'Tinkoff payment way available only on Custom Dash';
        this.snackbar.createItem(msg, CsdSnackbarLevels.ERROR);
        this._loading$.next(false);
        throw new Error(msg);
      default:
        this._loading$.next(false);
        break;
    }
  }
}
