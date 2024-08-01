import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { AboutDTO } from 'app/about/models/about.models';
import { AboutService } from 'app/about/services/about.service';

@Component({
  selector: 'csd-about-general',
  templateUrl: './general.component.html',
  styles: `
    .card {
        @apply tw-gap-5 xs:tw-gap-4;
    }
    .banner-wrapper {
        @apply tw-w-full tw-relative tw-h-40 xs:tw-h-28 tw-rounded-lg tw-overflow-hidden;
        img {
            @apply tw-object-cover;
        }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutGeneralComponent {
  @Input()
  about: AboutDTO | null = null;

  readonly owner$ = inject(AboutService).owner$;
}
