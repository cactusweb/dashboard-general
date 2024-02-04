import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { KeyInfoComponent } from './components/key-info/key-info.component';
import { MatIconModule } from '@angular/material/icon';
import { ActionsComponent } from './components/actions/actions.component';
import { GeneralComponent } from './components/general/general.component';
import { TagContainerComponent } from './common/components/tag-container.component';
import { BackLinkComponent } from './common/components/back-link.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentStripeComponent } from './components/payment-stripe/payment-stripe.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { PaymentCardBtnsComponent } from './components/payment-card/payment-card-btns/payment-card-btns.component';
import { MatDialogModule } from '@angular/material/dialog';

const route: Route = {
  path: '',
  component: DashboardComponent,
};

@NgModule({
  declarations: [
    DashboardComponent,
    KeyInfoComponent,
    ActionsComponent,
    GeneralComponent,
    TagContainerComponent,
    BackLinkComponent,
    PaymentInfoComponent,
    PaymentStripeComponent,
    PaymentCardComponent,
    PaymentCardBtnsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([route]),
    NgVarDirective,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
  ],
})
export class DashboardModule {}
