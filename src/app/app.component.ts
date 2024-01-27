import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CsdSnackbarLevels } from '@csd-modules/snackbar/interfaces/snackbar-item.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private snackbar: CsdSnackbarService) {
    setTimeout(() => {
      snackbar.createItem('first', CsdSnackbarLevels.ERROR);
    }, 20);
    setTimeout(() => {
      snackbar.createItem('second', CsdSnackbarLevels.ERROR);
    }, 2000);
    setTimeout(() => {
      const removeItem = snackbar.createItem('third', CsdSnackbarLevels.ERROR);
      setTimeout(() => {
        removeItem();
      }, 600);
    }, 3000);
  }
}
