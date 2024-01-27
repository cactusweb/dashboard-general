import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CsdSnackbarLevels } from '../interfaces/snackbar-item.models';

@Component({
  selector: 'csd-snackbar-item',
  templateUrl: './snackbar-item.component.html',
  styleUrls: ['./snackbar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarItemComponent {
  @Output()
  close = new EventEmitter<void>();

  @Input()
  text!: string;

  @Input()
  level!: CsdSnackbarLevels;

  readonly CsdSnackbarLevels = CsdSnackbarLevels;

  get iconName() {
    switch (this.level) {
      case CsdSnackbarLevels.ERROR:
        return 'icon-warn';
      case CsdSnackbarLevels.INFO:
        return 'icon-info';
      case CsdSnackbarLevels.SUCCESS:
        return 'icon-mark';
    }
  }
}
