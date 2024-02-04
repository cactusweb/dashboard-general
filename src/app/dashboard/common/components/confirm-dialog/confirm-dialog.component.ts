import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Inject,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmDialogData,
  ConfirmDialogOptions,
} from './models/confirm-dialog.model';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from '@csd-directives/ngvar.directive';

@Component({
  selector: 'csd-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  imports: [CommonModule, NgVarDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    private matDialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  @HostBinding('style.--primary-color')
  get primaryColor() {
    return this.data.primaryColor || null;
  }

  onLeftClick() {
    this.matDialogRef.close(ConfirmDialogOptions.LEFT);
  }
  onRightClick() {
    this.matDialogRef.close(ConfirmDialogOptions.RIGHT);
  }
}
