import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MethodSelectorComponent } from './components/method-selector/method-selector.component';
import { MethodCardComponent } from './components/method-card/method-card.component';
import { RecevierComponent } from './components/recevier/recevier.component';
import { ToolsModule } from '../tools/tools.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfoLinkComponent } from './components/info-link/info-link.component';
import { PaymentWindowComponent } from './payment-window.component';



@NgModule({
  declarations: [
    PaymentWindowComponent,
    MethodSelectorComponent,
    MethodCardComponent,
    RecevierComponent,
    InfoLinkComponent
  ],
  imports: [
    CommonModule,
    ToolsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [PaymentWindowComponent]
})
export class CryptoPaymentModule { }
