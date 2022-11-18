import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'unbind-approve',
  templateUrl: './unbind-approve.component.html',
  styleUrls: ['./unbind-approve.component.scss']
})
export class UnbindApproveComponent implements OnInit {
  @Output() onApprove = new EventEmitter()
  @Output() onClose = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(e: KeyboardEvent){
    this.onClose.emit()
  }

}
