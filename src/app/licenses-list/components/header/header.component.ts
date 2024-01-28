import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BindFormComponent } from '../bind-form/bind-form.component';

@Component({
  selector: 'csd-licenses-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private matDialog: MatDialog) {}
  onOpenBindForm() {
    this.matDialog.open(BindFormComponent, {
      panelClass: 'bind-form-popup',
      maxWidth: '450px',
      width: '100%',
    });
  }
}
