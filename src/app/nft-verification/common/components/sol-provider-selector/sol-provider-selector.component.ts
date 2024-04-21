import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SolanaProvidersTypes } from '../../services/models/solana.models';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CsdSolanaService } from '../../services/solana.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'csd-sol-provider-selector',
  templateUrl: './sol-provider-selector.component.html',
  styleUrls: ['./sol-provider-selector.component.scss'],
  imports: [MatDialogModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SolProviderSelectorComponent {
  readonly SolanaProvidersTypes = SolanaProvidersTypes;

  constructor(
    private dialogRef: MatDialogRef<SolProviderSelectorComponent>,
    @Inject(MAT_DIALOG_DATA)
    private selectProvider: (type: SolanaProvidersTypes) => void
  ) {}

  onSelectProvider(provider: SolanaProvidersTypes) {
    try {
      this.selectProvider(provider);
      this.dialogRef.close(true);
    } catch {}
  }
}
