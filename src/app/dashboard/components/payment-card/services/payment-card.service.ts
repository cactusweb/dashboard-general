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
import { DashboardRequests } from '@csd-dashboard/common/consts/dashboard-requests.consts';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { OrderDTO } from '@csd-models/order/order.models';
import { HttpService } from '@csd-services/http/http.service';
import { CsdOrderService } from '@csd-services/order.service';
import { UserDetailsService } from '@csd-services/user-details.service';
import { isUserDetailsGateActive } from '@csd-utils/user-details.utils';
import { selectUser } from '@csd-store/user/user.selectors';
import {
  EMPTY,
  BehaviorSubject,
  combineLatest,
  finalize,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@csd-store/state';
import { SetLicenseData } from '@csd-store/licenses/licenses.actions';

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
    private store: Store<State>,
    private userDetailsService: UserDetailsService,
  ) {
    this.activateLoading$ = this._activateLoading$.asObservable();
    this.renewLoading$ = this._renewLoading$.asObservable();
  }

  linkCard() {
    if (this.cardLinkOrder) {
      this.openDetailsFormAndLink();
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
            ownerName,
          ),
        ),
        finalize(() => this._activateLoading$.next(false)),
      )
      .subscribe({
        next: (order) => {
          this.cardLinkOrder = order;
          this.openDetailsFormAndLink();
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
            ConfirmDialogBtnColors.WARN,
          ),
          rightBtn: buildConfirmBtn(
            'Renew now',
            ConfirmDialogBtnClasses.FLAT,
            ConfirmDialogBtnColors.PRIMARY,
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
          ownerName,
        ),
      ),
      tap(() => this.handleSubCancellation()),
    );
  }

  private openDetailsFormAndLink() {
    combineLatest([this.dashService.owner$, this.store.select(selectUser)])
      .pipe(
        take(1),
        switchMap(([owner, user]) =>
          this.userDetailsService
            .openDetailsForm(
              isUserDetailsGateActive(owner, user) ? 'full' : 'email',
            )
            .pipe(
              switchMap((saved) =>
                saved ? this.linkOrder(this.cardLinkOrder!) : EMPTY,
              ),
            ),
        ),
      )
      .subscribe({
        error: () => {},
      });
  }

  private linkOrder(order: OrderDTO) {
    return this.userDetailsService.retryOnUserDetailsRequired(
      this.orderService.postOrderData({}, order),
    );
  }

  private renew() {
    this._renewLoading$.next(true);
    this.dashService.ownerName$
      .pipe(
        take(1),
        switchMap((ownerName) =>
          this.http.request<OrderDTO>(DashboardRequests.RENEW, null, ownerName),
        ),
        switchMap((order) =>
          this.userDetailsService.retryOnUserDetailsRequired(
            this.orderService.postOrderData({}, order, false),
          ),
        ),
        finalize(() => this._renewLoading$.next(false)),
      )
      .subscribe({
        next: () => this.dashService.handleSuccefullRenew(),
        error: () => {},
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
