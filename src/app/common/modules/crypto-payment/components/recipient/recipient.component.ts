import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UtilsService } from '@csd-services/utils.service';

@Component({
  selector: 'csd-crypto-recipient',
  templateUrl: './recipient.component.html',
  styleUrls: ['./recipient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CryptoRecipientComponent {
  @Input()
  recipient!: string | null;

  constructor(private utils: UtilsService) {}

  copyRecipient() {
    if (!this.recipient) {
      return;
    }
    this.utils.copy(this.recipient, true, 'Address copied!');
  }
}
