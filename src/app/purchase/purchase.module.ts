import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseComponent } from './purchase.component';
import { ToolsModule } from '../tools/tools.module';
import { DropStatusBtnComponent } from './components/drop-status-btn/drop-status-btn.component';
import { RouterModule, Routes } from '@angular/router';
import { PurchaseService } from './services/purchase.service';
import { PurchaseFormTitleComponent } from './components/purchase-form-title/purchase-form-title.component';
import { PurchaseFormComponent } from './components/purchase-form/purchase-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StatusSuccessComponent } from './components/status-success/status-success.component';
import { StatusFailedComponent } from './components/status-failed/status-failed.component';

const routes: Routes = [
  { path: '', component: PurchaseComponent }
]

@NgModule({
  declarations: [
    PurchaseComponent,
    DropStatusBtnComponent,
    PurchaseFormTitleComponent,
    PurchaseFormComponent,
    StatusSuccessComponent,
    StatusFailedComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ToolsModule,
  ],
  providers: [PurchaseService]
})
export class PurchaseModule { }
