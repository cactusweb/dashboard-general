import { NgModule } from '@angular/core';
import { LicensesListComponent } from './licenses-list.component';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

const route: Route = {
  path: '',
  component: LicensesListComponent,
};

@NgModule({
  declarations: [LicensesListComponent],
  imports: [CommonModule, RouterModule.forChild([route])],
})
export class LicensesListModule {}
