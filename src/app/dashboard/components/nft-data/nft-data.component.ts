import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LicenseNftDataDTO } from '@csd-models/license.models';

@Component({
  selector: 'csd-dashboard-nft-data',
  templateUrl: './nft-data.component.html',
  styleUrls: ['./nft-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NftDataComponent {
  @Input()
  nftData!: LicenseNftDataDTO;

  get wallet() {
    const walletLength = this.nftData.wallet.length;
    return (
      this.nftData.wallet.substring(0, 4) +
      '...' +
      this.nftData.wallet.substring(walletLength - 7, walletLength - 1)
    );
  }
}
