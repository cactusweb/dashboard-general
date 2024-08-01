import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { Route, RouterModule } from '@angular/router';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { CsdOwnerDataComponent } from '@csd-components/owner-data/owner-data.component';
import { AboutOwnerComponent } from './components/owner/owner.component';
import { AboutGeneralComponent } from './components/general/general.component';
import { MatButton } from '@angular/material/button';
import { AboutActionComponent } from './components/action/action.component';
import { AboutMembershipsLinkComponent } from './components/back-link.component';

const route: Route = {
  path: '',
  component: AboutComponent,
};

@NgModule({
  declarations: [
    AboutComponent,
    AboutOwnerComponent,
    AboutGeneralComponent,
    AboutActionComponent,
    AboutMembershipsLinkComponent,
  ],
  imports: [
    RouterModule.forChild([route]),
    NgOptimizedImage,
    AsyncPipe,
    CsdOwnerDataComponent,
    MatButton,
  ],
})
export class AboutModule {}
