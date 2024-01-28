import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'csd-license-empty',
  template: `
    <h2>No licenses available</h2>
    <p>
      Bind the keys you have, or make sure you logged in with the correct
      account.
    </p>
  `,
  styles: [
    `
      :host {
        @apply tw-grid tw-gap-2;
      }

      h2 {
        @apply tw-text-[22px] tw-leading-[27px] tw-font-semibold xs:tw-text-lg xs:tw-leading-[22px];
      }

      p {
        @apply tw-text-base tw-leading-5 tw-font-medium tw-max-w-xs xs:tw-max-w-none;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseEmptyComponent {}
