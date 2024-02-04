import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'csd-tag-container',
  template: `
    <p
      class="csd-tag-container"
      [class.csd-tag-container_disabled]="disabled && !skeletons"
    >
      <span class="csd-tag-label">
        {{ label }}
      </span>
      <span
        class="csd-tag tw-capitalize"
        [attr.data-skeleton-load]="skeletons ? '' : null"
      >
        <ng-content *ngIf="!skeletons" />
      </span>
    </p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagContainerComponent {
  @Input()
  label!: string;

  @Input()
  skeletons = false;

  @Input()
  disabled = false;
}
