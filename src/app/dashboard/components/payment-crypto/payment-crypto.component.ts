import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DashboardRequests } from '@csd-dashboard/common/consts/dashboard-requests.consts';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { OrderDTO } from '@csd-models/order/order.models';
import { CsdCryptoPaymentComponent } from '@csd-modules/crypto-payment/crypto-payment.component';
import { HttpService } from '@csd-services/http/http.service';
import { BehaviorSubject, finalize, take, takeUntil } from 'rxjs';

@Component({
  selector: 'csd-payment-crypto',
  templateUrl: './payment-crypto.component.html',
  styleUrls: ['./payment-crypto.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCryptoComponent {
  @Input()
  disabled!: boolean;

  readonly loading$ = new BehaviorSubject(false);

  private order?: OrderDTO;

  constructor(
    private http: HttpService,
    private matDialog: MatDialog,
    private dashService: DashboardService
  ) {}

  onRenew() {
    if (this.order) {
      this.processOrder();
      return;
    }

    this.loading$.next(true);
    this.http
      .request<OrderDTO>(DashboardRequests.RENEW)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (order) => {
          this.order = order;
          this.processOrder();
        },
        error: () => {},
      });
  }

  private processOrder() {
    const dialogRef = this.matDialog.open(CsdCryptoPaymentComponent, {
      maxWidth: '600px',
      width: '100%',
    });

    this.handleOpenedDialog(dialogRef);

    this.dashService.license$.pipe(take(1)).subscribe((lic) => {
      dialogRef.componentInstance.order = this.order!;
      dialogRef.componentInstance.primaryColor =
        lic.owner.primary_color || null;
    });
  }

  private handleOpenedDialog(
    dialogRef: MatDialogRef<CsdCryptoPaymentComponent>
  ) {
    dialogRef.componentInstance.orderSuccess
      .pipe(takeUntil(dialogRef.beforeClosed()))
      .subscribe(() => {
        dialogRef.close();
        this.dashService.handleSuccefullRenew();
      });
  }
}
