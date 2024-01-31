import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import { UtilsService } from '@csd-services/utils.service';

@Component({
  selector: 'csd-purchase-success',
  templateUrl: './purchase-success.component.html',
  styleUrls: ['./purchase-success.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseSuccessComponent {
  readonly license$ = inject(PurchaseService).receivedLicense$;
  readonly dashLink = this.getDashLink();

  constructor(private utilsService: UtilsService) {}

  private getDashLink() {
    const ownerName = inject(ActivatedRoute).snapshot.params[
      'owner_name'
    ] as string;
    return '/' + RouterPaths.DASHBOARD.replace(':owner_name', ownerName);
  }

  copy(key: string){
    this.utilsService.copy(key, true, 'Copied successfuly!')
  }
}
