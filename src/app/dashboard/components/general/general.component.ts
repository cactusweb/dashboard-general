import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { LicenseDTO, LicenseTypes } from '@csd-models/license.models';
import { DashboardService } from 'app/dashboard/services/dashboard.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'csd-dashboard-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent implements OnInit, OnDestroy {
  license: null | LicenseDTO = null;
  private readonly destroyed$ = new Subject<void>();

  readonly LicenseTypes = LicenseTypes;

  constructor(
    private dashService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {}

  get price() {
    return this.license && !this.isWithoutRenew
      ? this.license.payment.price
      : null;
  }

  get renewalDate() {
    return this.license && !this.isWithoutRenew
      ? this.license.expires_in!
      : null;
  }

  get joiningDate() {
    return this.license?.bought_at || this.license?.created_at;
  }

  private get isWithoutRenew() {
    return [LicenseTypes.LIFETIME, LicenseTypes.TRIAL].includes(
      this.license!.type
    );
  }

  ngOnInit(): void {
    this.dashService.license$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.license = res;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
