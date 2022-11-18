import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ToolsService } from 'src/app/tools/services/tools.service';
import { License } from '../../interfaces/license';

@Component({
  selector: 'license-card',
  templateUrl: './license-card.component.html',
  styleUrls: ['./license-card.component.scss'],
  host: {
    '[style.--primary-color]': 'primaryColor'
  },
  providers: [CurrencyPipe]
})
export class LicenseCardComponent implements OnInit {
  @Input() license!: License|undefined
  
  paymentPrice: string = '';
  link: string = '/licenses';

  primaryColor: string = 'var(--color--loading-data)';

  constructor(
    public tools: ToolsService,
    private currency: CurrencyPipe
  ) { }

  ngOnInit(): void {
    if ( !this.license ) return;

    this.primaryColor = this.license.owner.primary_color || '';

    this.paymentPrice = this.getPaymentPrice();
    this.link = `/${this.tools.replaceSymbol(this.license.owner.name)}/dashboard`
  }

  getPaymentPrice(){
    if ( !this.license ) return '';

    if ( this.license.type == 'lifetime' || this.license.type == 'trial' ) return this.license.type
  
    let priceStr = this.currency.transform(this.license.payment.price, this.license.payment.currency||'USD', 'symbol-narrow', '1.0-1')
    return `${priceStr} / month`;
  }
  
}
