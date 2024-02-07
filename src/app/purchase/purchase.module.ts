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
import { PurchaseCheckResults } from './steps/purchase-check-results/purchase-check-results.component';
import { PurchaseSuccessComponent } from './steps/purchase-success/purchase-success.component';
import { PurchaseFailedComponent } from './steps/purchase-failed/purchase-failed.component';
import { MatIconModule } from '@angular/material/icon';
import { PurchaseFormTitleComponent } from './steps/purchase-form/purchase-form-title/purchase-form-title.component';
import { CsdCryptoPaymentModule } from '@csd-modules/crypto-payment/crypto-payment.module';

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
    PurchaseCheckResults,
    PurchaseSuccessComponent,
    PurchaseFailedComponent,
    PurchaseFormTitleComponent,
  ],
  imports: [
    CommonModule,
    NgVarDirective,
    RouterModule.forChild([route]),
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    CsdCryptoPaymentModule,
  ],
})
export class PurchaseModule {}
