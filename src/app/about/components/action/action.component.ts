import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AboutActionDTO } from 'app/about/models/about.models';

const APP_URL = 'https://dashboard.cactusweb.io';

@Component({
  selector: 'csd-about-action',
  templateUrl: './action.component.html',
  styleUrl: './action.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutActionComponent {
  @Input()
  action: AboutActionDTO | null = null;

  get linkUrl() {
    if (this.isAppLink) {
      return this.action!.button.link.replace(APP_URL, '');
    }

    return this.action?.button.link;
  }

  get linkTarget() {
    if (this.isAppLink) {
      return '_self';
    }

    return '_blank';
  }

  private get isAppLink() {
    return this.action?.button.link.includes(APP_URL);
  }
}
