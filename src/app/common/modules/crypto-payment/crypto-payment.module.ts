import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CsdCryptoPaymentService } from './services/crypto-payment.service';
import { CsdCryptoPaymentComponent } from './crypto-payment.component';
import { CryptoHelpLinkComponent } from './components/help-link/help-link.component';
import { CryptoRecipientComponent } from './components/recipient/recipient.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { CryptoMethodSelectorComponent } from './components/method-selector/method-selector.component';
import { CryptoMethodOptionComponent } from './components/method-option/method-option.component';

@NgModule({
  declarations: [
    CsdCryptoPaymentComponent,
    CryptoHelpLinkComponent,
    CryptoRecipientComponent,
    CryptoMethodSelectorComponent,
    CryptoMethodOptionComponent,
  ],
  exports: [CsdCryptoPaymentComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    NgVarDirective,
  ],
  providers: [CsdCryptoPaymentService],
})
export class CsdCryptoPaymentModule {}
