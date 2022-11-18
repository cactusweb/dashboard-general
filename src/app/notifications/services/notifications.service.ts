import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../interfaces/notification';

interface InputNotification{
  id?: number,
  showTime?: number,
  text: string,
  type: 'err'|'success'|'primary'
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  primaryShowTime = 3800;
  notificationsCount: number = 0;

  private _notifications: Notification[] = [];
  private $notifications = new BehaviorSubject<Notification[]>([])
  public notifications = this.$notifications.asObservable();

  constructor() { }

  create(data: InputNotification){
    this.notificationsCount++;

    let notif: Notification = {
      ...data,
      id: data.id || this.notificationsCount,
      showTime: data.showTime || this.primaryShowTime
    }

    this._notifications.push(notif);
    this.$notifications.next(this._notifications);
    
    setTimeout(() => {
      // this.remove(notif);
    }, notif.showTime);
  }

  remove(data: Notification){
    this._notifications = this._notifications.filter(n => n.id != data.id)
    this.$notifications.next(this._notifications)
  }

  removeAll(){
    this._notifications = [];
    this.$notifications.next([]);
  }
}
