import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';
import { LicenseDTO, LicenseTypes } from '@csd-models/license.models';

@Component({
  selector: 'csd-dashboard-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneralComponent implements OnInit {
  license: null | LicenseDTO = null;

  readonly LicenseTypes = LicenseTypes;
  readonly #destroyRef = inject(DestroyRef);

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
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((res) => {
        this.license = res;
        this.cdr.markForCheck();
      });
  }
}
