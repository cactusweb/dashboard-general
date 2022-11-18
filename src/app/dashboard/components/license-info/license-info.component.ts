import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { License } from 'src/app/license-list/interfaces/license';

@Component({
  selector: 'app-license-info',
  templateUrl: './license-info.component.html',
  styleUrls: ['./license-info.component.scss'],
  providers: [DatePipe, CurrencyPipe]
})
export class LicenseInfoComponent implements OnInit {
  @Input() license: License|null = null;

  constructor(
    private date: DatePipe,
    private currency: CurrencyPipe,
  ) { }

  ngOnInit(): void {
  }


  getNextRenewalDate(){
    if ( !this.license ) return '';

    if (this.license.type == 'lifetime') return '—';
    else return this.date.transform(this.license.expires_in, 'dd.MM.YY')
  }

  getPaymentPrice(){
    if ( !this.license ) return '';

    if ( this.license.type == 'lifetime' || this.license.type == 'trial' ) return '—'

    return this.currency.transform(this.license.payment.price, this.license.payment.currency||'USD', 'symbol-narrow', '1.0-1')
  }
}
