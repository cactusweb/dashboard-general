import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OrderDTO } from '@csd-models/order/order.models';
import { HttpService } from '@csd-services/http/http.service';
import { OrderEmailFormComponent } from 'app/dashboard/common/components/order-email-form/order-email-form.component';
import { DashboardRequests } from 'app/dashboard/common/consts/dashboard-requests.consts';
import { DashboardService } from 'app/dashboard/services/dashboard.service';
import { BehaviorSubject, finalize, map, switchMap } from 'rxjs';

@Component({
  selector: 'csd-payment-card-btns',
  templateUrl: './payment-card-btns.component.html',
  styleUrls: ['./payment-card-btns.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentCardBtnsComponent {
  @Input()
  disabled!: boolean;

  readonly isCardLinked$ = this.dashService.license$.pipe(
    map((lic) => !!lic.payment.last_4)
  );

  readonly activateLoading$ = new BehaviorSubject(false);
  readonly renewLoading$ = new BehaviorSubject(false);
  readonly cancelLoading$ = new BehaviorSubject(false);

  private activateOrder?: OrderDTO;

  constructor(
    private http: HttpService,
    private dashService: DashboardService,
    private matDialog: MatDialog
  ) {}

  onActivate() {
    if (this.activateOrder) {
      this.openEmailForm();
      return;
    }

    this.activateLoading$.next(true);
    this.dashService.ownerName$
      .pipe(
        switchMap((ownerName) =>
          this.http.request<OrderDTO>(
            DashboardRequests.START_SUB,
            null,
            ownerName
          )
        ),
        finalize(() => this.activateLoading$.next(false))
      )
      .subscribe({
        next: (order) => {
          this.activateOrder = order;
          this.openEmailForm();
        },
        error: () => {},
      });
  }

  private openEmailForm() {
    this.matDialog.open(OrderEmailFormComponent, {
      maxWidth: '450px',
      width: '100%',
      data: {
        order: this.activateOrder!,
      },
    });
  }
}
