import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from '@csd-directives/ngvar.directive';
import { KeyInfoComponent } from './components/key-info/key-info.component';
import { MatIconModule } from '@angular/material/icon';
import { ActionsComponent } from './components/actions/actions.component';
import { GeneralComponent } from './components/general/general.component';
import { TagContainerComponent } from './common/tag-container.component';
import { BackLinkComponent } from './common/back-link.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([route]),
    NgVarDirective,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class DashboardModule {}
