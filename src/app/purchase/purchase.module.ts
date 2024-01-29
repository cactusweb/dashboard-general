import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { PurchaseComponent } from './purchase.component';
import { Route, RouterModule } from '@angular/router';
import { OwnerComponent } from './components/owner/owner.component';
import { DropStatusComponent } from './steps/drop-status/drop-status.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PurchaseFormComponent } from './steps/purchase-form/purchase-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const route: Route = {
  path: '',
  component: PurchaseComponent,
};

@NgModule({
  declarations: [
    PurchaseComponent,
    OwnerComponent,
    DropStatusComponent,
    PurchaseFormComponent,
  ],
  imports: [
    CommonModule,
    NgVarDirective,
    RouterModule.forChild([route]),
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PurchaseModule {}
