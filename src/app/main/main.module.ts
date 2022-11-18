import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToolsModule } from '../tools/tools.module';
import { RouterModule } from '@angular/router';
import { UserComponent } from './components/user/user.component';



@NgModule({
  declarations: [
    NavComponent,
    FooterComponent,
    UserComponent
  ],
  imports: [
    CommonModule,
    ToolsModule,
    RouterModule
  ],
  exports: [
    NavComponent,
    FooterComponent,
  ]
})
export class MainModule { }
