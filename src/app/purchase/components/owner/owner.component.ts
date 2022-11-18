import { Component, OnInit } from '@angular/core';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.scss']
})
export class OwnerComponent implements OnInit {

  constructor(
    public purchase: PurchaseService
  ) { }

  ngOnInit(): void {
  }

}
