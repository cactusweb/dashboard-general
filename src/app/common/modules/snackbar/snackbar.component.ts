import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CsdSnackbarService } from './services/snackbar.service';
import { CsdSnackbarItem } from './interfaces/snackbar-item.models';

@Component({
  selector: 'csd-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  readonly items$ = inject(CsdSnackbarService).items$;

  trackById(_: number, item: CsdSnackbarItem) {
    return item.id;
  }
}
