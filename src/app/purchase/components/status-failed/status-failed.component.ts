import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'status-failed',
  templateUrl: './status-failed.component.html',
  styleUrls: ['./status-failed.component.scss']
})
export class StatusFailedComponent implements OnInit {
  @Input() isPaymentFailed!: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
