import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { OwnerDTO } from '@csd-models/owner.models';

@Component({
  selector: 'csd-about-owner',
  template: `
    <div class="logo-wrapper" [attr.data-skeleton-load]="owner ? null : ''">
      @if(owner){
      <img [ngSrc]="owner.avatar" fill loading="lazy" alt="" />
      }
    </div>

    <h1 class="title" [attr.data-skeleton-load]="owner ? null : 'text'">
      {{ owner?.name }}
    </h1>
  `,
  styleUrl: './owner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutOwnerComponent {
  @Input()
  owner: OwnerDTO | null = null;
}
