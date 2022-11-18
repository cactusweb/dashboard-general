import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgvarDirective } from './directives/ngvar.directive';
import { BtnLoaderComponent } from './components/btn-loader/btn-loader.component';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    NgvarDirective,
    BtnLoaderComponent,
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule
  ],
  exports: [
    NgvarDirective,
    BtnLoaderComponent,
  ]
})
export class ToolsModule { }
