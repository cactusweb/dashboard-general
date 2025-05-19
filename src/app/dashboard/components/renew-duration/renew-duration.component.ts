import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { MatSelectModule } from '@angular/material/select';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CsdCryptoPaymentComponent } from '@csd-modules/crypto-payment/crypto-payment.component';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { finalize, map, switchMap, take, takeUntil } from 'rxjs';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { OrderDTO } from '@csd-models/order/order.models';
import { HttpService } from '@csd-services/http/http.service';
import { DashboardRequests } from '@csd-dashboard/common/consts/dashboard-requests.consts';
import { NgClass } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'csd-dashboard-renew-duration',
  templateUrl: './renew-duration.component.html',
  styleUrl: './renew-duration.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule,
    MatIconModule,
    NgVarDirective,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatDialogModule,
    NgClass,
  ],
})
export class CsdDashboardRenewDurationComponent {
  @HostBinding('style.--primary-color')
  primaryColor: string | null = null;

  readonly duractionControl = new FormControl(1, Validators.required);
  readonly loading = signal(false);

  readonly ownerSupportLink;

  #order: OrderDTO | undefined;
  private readonly dashService: DashboardService = inject(MAT_DIALOG_DATA);

  constructor(
    private matDialog: MatDialog,
    private http: HttpService,
    private dialogRef: MatDialogRef<CsdDashboardRenewDurationComponent>,
  ) {
    this.dashService.license$
      .pipe(
        take(1),
        map((d) => d.owner.primary_color),
      )
      .subscribe((res) => (this.primaryColor = res));

    this.ownerSupportLink = toSignal(this.getOwnerSupportLink());
  }

  onSubmit() {
    if (
      this.#order &&
      this.#order.duration === Number(this.duractionControl.value)
    ) {
      return this.processOrder(this.#order);
    }

    this.loading.set(true);
    this.dashService.ownerName$
      .pipe(
        take(1),
        switchMap((ownerName) =>
          this.http.request<OrderDTO>(
            DashboardRequests.RENEW,
            null,
            ownerName,
            `?duration=${this.duractionControl.value}`,
          ),
        ),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (order) => {
          this.#order = order;
          this.processOrder(this.#order);
        },
        error: () => {},
      });
  }

  private processOrder(order: OrderDTO) {
    const dialogRef = this.matDialog.open(CsdCryptoPaymentComponent, {
      maxWidth: '600px',
      width: '100%',
    });

    this.handleOpenedDialog(dialogRef);

    this.dashService.license$.pipe(take(1)).subscribe((lic) => {
      dialogRef.componentInstance.order = order!;
      dialogRef.componentInstance.primaryColor =
        lic.owner.primary_color || null;
      dialogRef.componentInstance.supportLink = lic.owner.support_link;
    });
  }

  private handleOpenedDialog(
    dialogRef: MatDialogRef<CsdCryptoPaymentComponent>,
  ) {
    dialogRef.componentInstance.orderSuccess
      .pipe(takeUntil(dialogRef.beforeClosed()))
      .subscribe(() => {
        dialogRef.close();
        this.dashService.handleSuccefullRenew(this.#order?.duration);
        this.dialogRef.close();
      });
  }

  private getOwnerSupportLink() {
    return this.dashService.license$.pipe(map((d) => d.owner.support_link));
  }
}
