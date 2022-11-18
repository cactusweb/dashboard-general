import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Notification } from '../../interfaces/notification';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements AfterViewInit {
  @Input() item!: Notification;

  constructor(
    private serv: NotificationsService,
    private eRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    let maxHeight = this.eRef.nativeElement.querySelector('.notification').offsetHeight
    this.renderer.addClass(this.eRef.nativeElement, 'show')
    this.renderer.setStyle(this.eRef.nativeElement, 'max-height', `${maxHeight+8}px`)
    setTimeout(() => {
      this.renderer.setStyle(this.eRef.nativeElement, 'overflow', `initial`)
    }, 200);
    
    setTimeout(() => {
      this.onClose()
    }, this.item.showTime-200);
  }

  onClose(){
    this.renderer.removeClass(this.eRef.nativeElement, 'show')
    this.renderer.removeStyle(this.eRef.nativeElement, 'max-height')
    this.renderer.removeStyle(this.eRef.nativeElement, 'overflow')
    setTimeout(() => {
      this.serv.remove(this.item)
    }, 200);
  }

}
