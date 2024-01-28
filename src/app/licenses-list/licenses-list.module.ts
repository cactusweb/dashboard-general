import { NgModule } from '@angular/core';
import { LicensesListComponent } from './licenses-list.component';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { LicenseCardWrapperComponent } from './components/license-card-wrapper/license-card-wrapper.component';
import { LicenseDataComponent } from './components/license-data/license-data.component';
import { LicenseEmptyComponent } from './components/license-empty/license-empty.component';

const route: Route = {
  path: '',
  component: LicensesListComponent,
};

@NgModule({
  declarations: [
    LicensesListComponent,
    HeaderComponent,
    LicenseCardWrapperComponent,
    LicenseDataComponent,
    LicenseEmptyComponent,
  ],
  imports: [CommonModule, RouterModule.forChild([route]), MatIconModule],
})
export class LicensesListModule {}
