import { NgModule } from '@angular/core';
import { CsdSnackbarService } from './services/snackbar.service';
import { SnackbarComponent } from './snackbar.component';
import { CommonModule } from '@angular/common';
import { SnackbarItemComponent } from './components/snackbar-item.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SnackbarComponent, SnackbarItemComponent],
  imports: [CommonModule, MatIconModule],
  exports: [SnackbarComponent],
  providers: [CsdSnackbarService],
})
export class CsdSnackbarModule {}
