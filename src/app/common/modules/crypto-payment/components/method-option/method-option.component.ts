import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CryptoPaymentOptionDTO } from '@csd-modules/crypto-payment/models/crypto-payment.models';

@Component({
  selector: 'csd-crypto-method-option',
  templateUrl: './method-option.component.html',
  styleUrls: ['./method-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CryptoMethodOptionComponent {
  @Input()
  selected = false;

  @Input()
  option!: CryptoPaymentOptionDTO;
}
