import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CryptoPaymentMethod } from 'src/app/purchase/interfaces/crypto-payment-method';

@Component({
  selector: 'method-selector',
  templateUrl: './method-selector.component.html',
  styleUrls: ['./method-selector.component.scss'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MethodSelectorComponent),
      multi: true
   },
  ]
})
export class MethodSelectorComponent implements ControlValueAccessor {
  @Input() paymentMethods: CryptoPaymentMethod[] = []

  showDropDown: boolean = false;

  _val: CryptoPaymentMethod|undefined;
  set val(value: number|undefined){
    this._val = this.paymentMethods.find(m => m.id == value);
    if ( this.onChange )
      this.onChange(value)
  }

  onChange!: (_: any) => void
  constructor() { }

  writeValue(value: number): void {
    console.log(value)
    this.val = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {}

}
