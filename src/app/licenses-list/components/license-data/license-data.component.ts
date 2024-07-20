import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LicenseDTO, LicenseTypes } from '@csd-models/license.models';
import { CsdCurrencyPipe } from 'app/common/pipes/csd-currency.pipe';

@Component({
  selector: 'csd-license-data',
  templateUrl: './license-data.component.html',
  styleUrls: ['./license-data.component.scss'],
  providers: [CsdCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDataComponent {
  @Input()
  license?: LicenseDTO;

  @Input()
  pending = false;

  readonly LicenseTypes = LicenseTypes;

  constructor(private currency: CsdCurrencyPipe) {}

  get paymentPrice() {
    if (!this.license) {
      return '';
    }

    if (
      [LicenseTypes.LIFETIME, LicenseTypes.TRIAL].includes(this.license.type)
    ) {
      return this.license.type;
    }

    const price = this.currency.transform(
      this.license.payment.price,
      this.license.payment.currency || 'USD'
    );

    return `${price} / month`;
  }
}
