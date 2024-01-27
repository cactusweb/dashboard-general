import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CsdSnackbarService } from './services/snackbar.service';

@Component({
  selector: 'csd-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarComponent {
  readonly items$ = inject(CsdSnackbarService).items$;
}
