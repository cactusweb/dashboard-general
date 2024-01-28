import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LicenseDTO, LicenseTypes } from '@csd-models/license.models';

@Component({
  selector: 'csd-license-data',
  templateUrl: './license-data.component.html',
  styleUrls: ['./license-data.component.scss'],
  providers: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseDataComponent {
  @Input()
  license?: LicenseDTO;

  @Input()
  pending = false;

  readonly LicenseTypes = LicenseTypes;

  constructor(private currency: CurrencyPipe) {}

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
      this.license.payment.currency || 'USD',
      'symbol-narrow',
      '1.0-1'
    );

    return `${price} / month`;
  }
}
