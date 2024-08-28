import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AboutActionDTO } from 'app/about/models/about.models';

const APP_HOSTNAME = 'dashboard.cactusweb.io';

@Component({
  selector: 'csd-about-action',
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutActionComponent {
  @Input()
  action: AboutActionDTO | null = null;

  get url() {
    return this.action ? new URL(this.action.button.link) : null;
  }

  get queryParams() {
    return !this.url ? null : Object.fromEntries(this.url.searchParams);
  }

  get isAppLink() {
    return this.url?.hostname === APP_HOSTNAME;
  }
}
