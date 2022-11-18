import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, map, Observable, take } from 'rxjs';
import { PurchaseService } from '../../services/purchase.service';

@Component({
  selector: 'purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  providers: [CurrencyPipe]
})
export class PurchaseFormComponent implements OnInit {
  form!: FormGroup
  loading: boolean = false;

  payment: Observable<{ way: string, currency: string, price: number }>

  constructor(
    private drop: PurchaseService,
    private currency: CurrencyPipe
  ) { 
    this.payment = drop.getDrop()
      .pipe(
        map(d => {
          return {
            way: d.payment_way,
            currency: d.currency,
            price: d.price
          }
        })
      )
  }

  ngOnInit(): void {
    this.generateForm();
  }

  generateForm(){
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    })
  }

  onSubmit(){
    this.form.markAllAsTouched();
    if ( this.form.invalid ) return;

    this.loading = true;
    this.drop.freePurchase( this.form.controls['email'].value )
      .pipe(
        take(1),
        finalize(() => this.loading = false)
      )
      .subscribe({
        error: () => {},
        next: d => {}
      })

  }

  getDropPrice(payment: { way: string, currency: string, price: number }|null){
    if ( !payment )
      return '';

    return ` ` + this.currency.transform(payment.price, payment.currency||'USD', 'symbol-narrow', '1.0-1');
  }

}
