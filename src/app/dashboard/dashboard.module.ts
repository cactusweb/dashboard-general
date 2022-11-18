import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { ActionComponent } from './components/action/action.component';
import { KeyInfoComponent } from './components/key-info/key-info.component';
import { LicenseInfoComponent } from './components/license-info/license-info.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ReferralGiftsComponent } from './components/referral-gifts/referral-gifts.component';
import { ReferralComponent } from './components/referral/referral.component';
import { UnbindApproveComponent } from './components/unbind-approve/unbind-approve.component';
import { ToolsModule } from '../tools/tools.module';
import { DashboardService } from './services/dashboard.service';
import { OwnerComponent } from './components/owner/owner.component';
import { LinkToMainComponent } from './components/link-to-main/link-to-main.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, data: { title: 'Dashboard' } }
]

@NgModule({
  declarations: [
    DashboardComponent,
    ReferralComponent,
    ActionComponent,
    KeyInfoComponent,
    PaymentComponent,
    LicenseInfoComponent,
    ReferralGiftsComponent,
    UnbindApproveComponent,
    OwnerComponent,
    LinkToMainComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToolsModule,
  ],
  providers: [DashboardService]
})
export class DashboardModule { }
