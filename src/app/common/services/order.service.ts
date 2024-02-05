import { Injectable } from '@angular/core';
import { HttpService } from './http/http.service';
import { Requests } from '@csd-consts/requests.consts';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';
import { OrderDTO } from '@csd-models/order/order.models';
import { PaymentWays } from '@csd-models/order/payment.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { LicenseDTO } from '@csd-models/license.models';

interface OrderDataDTO {
  payment_url: string;
}

@Injectable()
export class CsdOrderService {
  readonly loading$;

  private readonly _loading$ = new BehaviorSubject(false);

  constructor(private http: HttpService, private snackbar: CsdSnackbarService) {
    this.loading$ = this._loading$.asObservable().pipe(shareReplay());
  }

  postOrderData(
    orderData: Record<string, any>,
    order: OrderDTO,
    handle: boolean = true
  ): Observable<LicenseDTO | OrderDataDTO | undefined> {
    this._loading$.next(true);

    if (this.isPaidOrder(order)) {
      return this.purchasePaidOrder(orderData, order, handle);
    }
    return this.purchaseFreeOrder(orderData, order);
  }

  isPaidOrder(order: OrderDTO) {
    return !(order.payment_way === PaymentWays.NONE || order.price === 0);
  }

  private purchaseFreeOrder(orderData: Record<string, any>, order: OrderDTO) {
    return this.http
      .request<LicenseDTO>(Requests.PUT_FREE_ORDER_DATA, orderData, order.id)
      .pipe(finalize(() => this._loading$.next(false)));
  }

  private purchasePaidOrder(
    orderData: Record<string, any>,
    order: OrderDTO,
    handle: boolean
  ) {
    return this.http
      .request<OrderDataDTO | undefined>(
        Requests.PUT_ORDER_DATA,
        orderData,
        order.id
      )
      .pipe(
        tap((d) => {
          if (handle) {
            this.handleOrder(d, order);
          }
        }),
        catchError((err) => {
          this._loading$.next(false);
          return throwError(() => err);
        })
      );
  }

  private handleOrder(data: OrderDataDTO | undefined, order: OrderDTO) {
    if (!data) {
      this._loading$.next(false);
      return;
    }

    switch (order.payment_way) {
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
