import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HELP_LINK } from '@csd-modules/crypto-payment/consts/crypto-payments.consts';

@Component({
  selector: 'csd-crypto-help-link',
  template: `
    <a [href]="HELP_LINK" target="_blank" class="row">
      <mat-icon fontIcon="icon-info" />
      <span>How to make a payment</span>
    </a>
  `,
  styles: [
    `
      :host {
        @apply tw-grid tw-justify-center;
      }
      a {
        @apply tw-gap-1.5 tw-text-sm tw-font-medium tw-text-black hover:tw-text-primary;
        &:hover {
          color: var(--primary-color);
        }
        transition: 0.3s;
      }
      mat-icon {
        @apply tw-leading-[15px] tw-mt-px;
      }
      span {
        @apply tw-underline tw-leading-[17px];
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CryptoHelpLinkComponent {
  readonly HELP_LINK = HELP_LINK;
}
