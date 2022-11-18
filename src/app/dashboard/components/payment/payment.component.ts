import { Component, Input, OnInit } from '@angular/core';
import { finalize, take } from 'rxjs';
import { LicensePayment } from 'src/app/license-list/interfaces/license-payment';
import { LicensesService } from 'src/app/license-list/services/licenses.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @Input() payment: LicensePayment|undefined;
  @Input() licenseType: 'trial' | 'trial-renewal' | 'renewal' | 'lifetime' | undefined;

  showBindCardForm: boolean = false;

  loading: boolean = false;

  constructor(
    private lic: LicensesService,
  ) { }

  ngOnInit(): void {
  }


  getCardNum(){
    if ( !this.payment ) return '';
    if ( !this.payment.last_4 || this.licenseType == 'lifetime' || this.licenseType == 'trial' ) return '—';
    return `**** ${this.payment.last_4}`
  }

  cancel(){
    this.loading = true;

    // this.lic.cancelPayment()
    //   .pipe(
    //     take(1),
    //     finalize(() => this.loading = false)
    //   )
    //   .subscribe({error: () => {}})
  }

  
  bindCard(){
    this.loading = true;

    // this.bind.getBindOrder()
    //   .pipe(
    //     take(1),
    //     finalize(() => this.loading = false)
    //   )
    //   .subscribe({
    //     next: () => this.showBindCardForm = true,
    //     error: () => {}
    //   })
      
  }


  paymentIsDisabled(){
    // return (this.payment && this.payment.way == '' || (this.licenseType == 'lifetime' || this.licenseType == 'trial'))
    return true
  }

}
