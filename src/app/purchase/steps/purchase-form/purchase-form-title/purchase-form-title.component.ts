import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import { map } from 'rxjs';

@Component({
  selector: 'csd-purchase-form-title',
  templateUrl: './purchase-form-title.component.html',
  styleUrls: ['./purchase-form-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseFormTitleComponent {
  readonly inviter$ = inject(PurchaseService).drop$.pipe(map((d) => d.inviter));
}
