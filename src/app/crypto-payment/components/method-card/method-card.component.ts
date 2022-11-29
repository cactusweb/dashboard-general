import { Component, Input, OnInit } from '@angular/core';
import { CryptoPaymentMethod } from 'src/app/purchase/interfaces/crypto-payment-method';

@Component({
  selector: 'method-card',
  templateUrl: './method-card.component.html',
  styleUrls: ['./method-card.component.scss']
})
export class MethodCardComponent implements OnInit {
  @Input() method!: CryptoPaymentMethod
  @Input() active: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
