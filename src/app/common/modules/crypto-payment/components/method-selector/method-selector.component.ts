import {
  ChangeDetectionStrategy,
  Component,
  Input,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CryptoPaymentOptionDTO } from '@csd-modules/crypto-payment/models/crypto-payment.models';

type MethodId = string;

@Component({
  selector: 'csd-crypto-method-selector',
  templateUrl: './method-selector.component.html',
  styleUrls: ['./method-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CryptoMethodSelectorComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CryptoMethodSelectorComponent implements ControlValueAccessor {
  @Input()
  paymentOptions!: CryptoPaymentOptionDTO[];

  val!: MethodId | null;

  onTouch!: () => void;
  onChange!: (_: MethodId) => void;

  writeValue(val: MethodId | null): void {
    this.val = val;
  }
  registerOnChange(fn: (_: MethodId) => void) {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setValue(val: MethodId) {
    this.val = val;
    this.onChange(val);
  }

  trackById(_: number, item: CryptoPaymentOptionDTO) {
    return item.id;
  }
}
