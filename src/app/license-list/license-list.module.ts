import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LicenseListComponent } from './license-list.component';
import { RouterModule, Routes } from '@angular/router';
import { LicenseCardComponent } from './components/license-card/license-card.component';
import { HeaderComponent } from './components/header/header.component';
import { ToolsModule } from '../tools/tools.module';
import { BindModule } from '../bind/bind.module';

const routes: Routes = [
  { path: '', component: LicenseListComponent, data: { title: 'Licenses' } }
]

@NgModule({
  declarations: [
    LicenseListComponent,
    LicenseCardComponent,
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ToolsModule,
    BindModule
  ]
})
export class LicenseListModule { }
