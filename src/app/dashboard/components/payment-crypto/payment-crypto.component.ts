import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { BehaviorSubject } from 'rxjs';
import { CsdDashboardRenewDurationComponent } from '../renew-duration/renew-duration.component';

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

  constructor(
    private matDialog: MatDialog,
    private dashService: DashboardService,
  ) {}

  onRenew() {
    this.matDialog.open(CsdDashboardRenewDurationComponent, {
      maxWidth: '600px',
      width: '100%',
      data: this.dashService,
    });
  }
}
