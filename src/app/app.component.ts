import { Component } from '@angular/core';
import { SeoService } from './tools/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'dashboard-general-v2';

  constructor(
    private seo: SeoService
  ){
    this.seo.autoUpdateTags();
  }

}
