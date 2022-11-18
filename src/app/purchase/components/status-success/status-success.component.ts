import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ToolsService } from 'src/app/tools/services/tools.service';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'status-success',
  templateUrl: './status-success.component.html',
  styleUrls: ['./status-success.component.scss']
})
export class StatusSuccessComponent implements OnInit {
  link: string = '/licenses';
  key: string = '';

  constructor(
    public drop: PurchaseService,
    public tools: ToolsService
  ) {
  }

  ngOnInit(): void {
    if ( !this.drop.purchasedLicense ) return;
    this.key = this.drop.purchasedLicense.key;
    this.link = `/${this.tools.replaceSymbol(this.drop.purchasedLicense.owner.name)}/dashboard`
  }

}
