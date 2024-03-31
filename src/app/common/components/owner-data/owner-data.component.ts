import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OwnerDTO } from '@csd-models/owner.models';

@Component({
  selector: 'csd-owner-data',
  templateUrl: './owner-data.component.html',
  styleUrls: ['./owner-data.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CsdOwnerDataComponent {
  @Input()
  owner?: OwnerDTO | null;
}
