import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications.component';
import { ItemComponent } from './components/item/item.component';
import { ToolsModule } from '../tools/tools.module';



@NgModule({
  declarations: [
    NotificationsComponent,
    ItemComponent
  ],
  imports: [
    CommonModule,
    ToolsModule
  ],
  exports: [NotificationsComponent]
})
export class NotificationsModule { }
