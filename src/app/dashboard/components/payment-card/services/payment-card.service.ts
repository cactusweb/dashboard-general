import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@csd-dashboard/common/components/confirm-dialog/confirm-dialog.component';
import { buildConfirmBtn } from '@csd-dashboard/common/components/confirm-dialog/helpers/confirm-dialog.helper';
import {
  ConfirmDialogBtnClasses,
  ConfirmDialogBtnColors,
  ConfirmDialogData,
  ConfirmDialogOptions,
} from '@csd-dashboard/common/components/confirm-dialog/models/confirm-dialog.model';
import { OrderEmailFormComponent } from '@csd-dashboard/common/components/order-email-form/order-email-form.component';
import { DashboardRequests } from '@csd-dashboard/common/consts/dashboard-requests.consts';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { OrderDTO } from '@csd-models/order/order.models';
import { HttpService } from '@csd-services/http/http.service';
import { CsdOrderService } from '@csd-services/order.service';
import { BehaviorSubject, finalize, map, switchMap, take, tap } from 'rxjs';
import * as dateFns from 'date-fns';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { SetLicenseData } from '@csd-store/licenses/licenses.actions';
import { RenewSuccessComponent } from '@csd-dashboard/common/components/renew-success.component';

@Injectable()
export class PaymentCardService {
  readonly activateLoading$;
  readonly renewLoading$;

  private readonly _activateLoading$ = new BehaviorSubject(false);
  private readonly _renewLoading$ = new BehaviorSubject(false);
  private cardLinkOrder?: OrderDTO;

  constructor(
    private dashService: DashboardService,
    private matDialog: MatDialog,
    private http: HttpService,
    private orderService: CsdOrderService,
    private store: Store<State>
  ) {
    this.activateLoading$ = this._activateLoading$.asObservable();
    this.renewLoading$ = this._renewLoading$.asObservable();
  }

  linkCard() {
    if (this.cardLinkOrder) {
      this.openEmailForm();
      return;
    }

    this._activateLoading$.next(true);
    this.dashService.ownerName$
      .pipe(
        take(1),
        switchMap((ownerName) =>
          this.http.request<OrderDTO>(
            DashboardRequests.START_SUB,
            null,
            ownerName
          )
        ),
        finalize(() => this._activateLoading$.next(false))
      )
      .subscribe({
        next: (order) => {
          this.cardLinkOrder = order;
          this.openEmailForm();
        },
        error: () => {},
      });
  }

  renewNow() {
    this.matDialog
      .open(ConfirmDialogComponent, {
        maxWidth: '500px',
        width: '100%',
        data: {
          leftBtn: buildConfirmBtn(
            'Cancel',
            ConfirmDialogBtnClasses.STROKED,
            ConfirmDialogBtnColors.WARN
          ),
          rightBtn: buildConfirmBtn(
            'Renew now',
            ConfirmDialogBtnClasses.FLAT,
            ConfirmDialogBtnColors.PRIMARY
          ),
          title: 'Are you sure?',
          description: `Your renewal amount will be debited from the linked card. \nContinue?`,
        } as ConfirmDialogData,
      })
      .beforeClosed()
      .subscribe((data?: ConfirmDialogOptions) => {
        if (data === ConfirmDialogOptions.RIGHT) {
          this.renew();
        }
      });
  }

  cancelSub() {
    return this.dashService.ownerName$.pipe(
      take(1),
      switchMap((ownerName) =>
        this.http.request(
          DashboardRequests.CANCEL_SUBSCRIPTION,
          null,
          ownerName
        )
      ),
      tap(() => this.handleSubCancellation())
    );
  }

  private openEmailForm() {
    this.dashService.license$
      .pipe(map((lic) => lic.payment.email))
      .subscribe((email) => {
        this.matDialog.open(OrderEmailFormComponent, {
          maxWidth: '450px',
          width: '100%',
          data: {
            order: this.cardLinkOrder!,
            email,
          },
        });
      });
  }

  private renew() {
    this._renewLoading$.next(true);
    this.dashService.ownerName$
      .pipe(
        take(1),
        switchMap((ownerName) =>
          this.http.request<OrderDTO>(DashboardRequests.RENEW, null, ownerName)
        ),
        switchMap((order) => this.orderService.postOrderData({}, order, false)),
        finalize(() => this._renewLoading$.next(false))
      )
      .subscribe({
        next: () => this.handleSuccefullRenew(),
        error: () => {},
      });
  }

  private handleSuccefullRenew() {
    this.dashService.license$.pipe(take(1)).subscribe((lic) => {
      const newLicData = {
        ...lic,
        expires_in: dateFns.addMonths(lic.expires_in!, 1).getTime(),
      };

      this.store.dispatch(new SetLicenseData(newLicData));

      this.matDialog.open(RenewSuccessComponent, {
        maxWidth: '405px',
        width: '100%',
      });
    });
  }

  private handleSubCancellation() {
    this.dashService.license$.pipe(take(1)).subscribe((lic) => {
      const newLicData = {
        ...lic,
        payment: {
          ...lic.payment,
          last_4: undefined,
          exp_date: undefined,
        },
      };
      this.store.dispatch(new SetLicenseData(newLicData));
    });
  }
}
