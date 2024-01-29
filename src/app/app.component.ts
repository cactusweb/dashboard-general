import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'csd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(reg: MatIconRegistry) {
    reg.registerFontClassAlias('Font Icons', 'fi');
    reg.setDefaultFontSetClass('fi');
  }
}
