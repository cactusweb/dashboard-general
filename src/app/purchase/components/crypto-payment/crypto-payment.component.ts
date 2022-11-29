import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToolsService } from 'src/app/tools/services/tools.service';
import { Order } from '../../interfaces/order';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'crypto-payment',
  templateUrl: './crypto-payment.component.html',
  styleUrls: ['./crypto-payment.component.scss']
})
export class CryptoPaymentComponent implements OnInit {
  drop: Observable<Order>

  constructor(
    private purchase: PurchaseService,
    private tools: ToolsService
  ) {
    this.drop = this.purchase.getDrop()
  }

  ngOnInit(): void {
    
  }

  onSuccess(){
    this.purchase.$purchaseState.next('status-check')
    this.tools.generateNotification('Successful payment', 'success')
  }

  

}
