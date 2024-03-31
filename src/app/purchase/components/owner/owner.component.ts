import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';

@Component({
  selector: 'csd-purchase-owner',
  templateUrl: './owner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerComponent {
  readonly owner$ = inject(PurchaseService).owner$;
}
