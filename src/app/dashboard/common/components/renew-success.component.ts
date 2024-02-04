import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'csd-renew-success',
  template: `
    <div class="card tw-gap-3 tw-justify-items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
      >
        <path
          d="M39.9974 73.3334C21.5879 73.3334 6.66406 58.4096 6.66406 40.0001C6.66406 21.5906 21.5879 6.66675 39.9974 6.66675C58.4069 6.66675 73.3307 21.5906 73.3307 40.0001C73.3105 58.4012 58.3985 73.3132 39.9974 73.3334ZM39.9441 66.6668H39.9974C54.7198 66.652 66.6448 54.7091 66.6374 39.9868C66.63 25.2644 54.6931 13.3334 39.9707 13.3334C25.2483 13.3334 13.3114 25.2644 13.3041 39.9868C13.2967 54.7091 25.2217 66.652 39.9441 66.6668ZM33.3307 56.6667L19.9974 43.3334L24.6974 38.6334L33.3307 47.2334L55.2974 25.2667L59.9974 30.0001L33.3307 56.6667Z"
          class="tw-fill-primary"
        />
      </svg>

      <div class="tw-grid tw-gap-2 tw-text-center">
        <h2 class="card__title">Congratulations!</h2>
        <p class="tw-text-base tw-leading-5 tw-font-medium">
          The subscription was successfully renewed.
        </p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RenewSuccessComponent {}
