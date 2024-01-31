import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterPaths } from '@csd-consts/router-paths.conts';

@Component({
  selector: 'csd-purchase-failed',
  templateUrl: './purchase-failed.component.html',
  styleUrls: ['./purchase-failed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseFailedComponent {
  readonly licensesLink = RouterPaths.LICENSES;
}
