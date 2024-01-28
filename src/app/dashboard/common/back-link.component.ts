import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterPaths } from '@csd-consts/router-paths.conts';

@Component({
  selector: 'csd-back-link',
  template: ` <a routerLink="/licenses" class="row link">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
    >
      <path
        d="M13 4H1M1 4L3.4 1M1 4L3.4 7"
        stroke="#5F8CA0"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    All licenses
  </a>`,
  styles: [
    `
      :host {
        @apply tw-absolute -tw-top-4 xs:-tw-top-3 tw-left-0 -tw-translate-y-full;
      }

      .link {
        @apply tw-justify-start tw-gap-1 xs:tw-text-sm tw-font-medium;
        color: #5f8ca0;

        svg {
          transition: 0.3s;
        }

        &:hover svg {
          @apply -tw-translate-x-1;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackLinkComponent {
  readonly link = RouterPaths.LICENSES;
}
