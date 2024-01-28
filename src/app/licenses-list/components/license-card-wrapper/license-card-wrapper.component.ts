import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

@Component({
  selector: 'csd-license-card-wrapper',
  templateUrl: './license-card-wrapper.component.html',
  styleUrls: ['./license-card-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseCardWrapperComponent {
  @Input()
  color: string | undefined;

  @Input()
  disabled = false;

  readonly disabledColor = '#5F8CA0';

  @HostBinding('style.--primary-color')
  get primaryColor() {
    return this.disabled ? this.disabledColor : this.color || '#ccc';
  }
}
