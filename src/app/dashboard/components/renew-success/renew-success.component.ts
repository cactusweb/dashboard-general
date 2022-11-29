import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'renew-success',
  templateUrl: './renew-success.component.html',
  styleUrls: ['./renew-success.component.scss']
})
export class RenewSuccessComponent {
  @Output() onClose = new EventEmitter()

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(e: KeyboardEvent){
    this.onClose.emit();
  }
}
