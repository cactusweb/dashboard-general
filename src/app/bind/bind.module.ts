import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BindComponent } from './bind.component';
import { NgxMaskModule } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolsModule } from '../tools/tools.module';



@NgModule({
  declarations: [
    BindComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    ToolsModule
  ],
  exports: [
    BindComponent
  ]
})
export class BindModule { }
