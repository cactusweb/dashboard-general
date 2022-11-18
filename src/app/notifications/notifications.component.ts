import { Component, OnInit } from '@angular/core';
import { Notification } from './interfaces/notification';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor(
    public service: NotificationsService
  ) { 
  }

  ngOnInit(): void {
  }

  track(index: number, item: Notification){
    return item.id
  }
}
