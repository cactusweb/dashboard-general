import { CurrencyPipe, formatCurrency } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import {
  CRYTPO_CURRENCIES_CODES,
  CryptoCurrenciesCodes,
  CryptoCurrenciesUnicodes,
} from './models/currency.models';

@Pipe({
  name: 'csdCurrency',
  standalone: true,
})
export class CsdCurrencyPipe implements PipeTransform {
  readonly CURRENCY_DISPLAY = 'symbol-narrow';
  readonly DIGITS_INFO = '1.0-1';
  readonly DIGITS_INFO_CRYPTO = '1.0-5';

  constructor(
    private currencyPipe: CurrencyPipe,
    @Inject(LOCALE_ID) private localId: string
  ) {}

  transform(value: number, currencyCode: string) {
    if (!CRYTPO_CURRENCIES_CODES.includes(currencyCode)) {
      return this.currencyPipe.transform(
        value,
        currencyCode,
        this.CURRENCY_DISPLAY,
        this.DIGITS_INFO
      );
    }

    const stringValue = formatCurrency(
      value,
      this.localId,
      '',
      undefined,
      this.DIGITS_INFO_CRYPTO
    );

    let cryptoCurrencyIcon = '';

    switch (currencyCode) {
      case CryptoCurrenciesCodes.ETH:
        cryptoCurrencyIcon = CryptoCurrenciesUnicodes.ETH;
        break;
      case CryptoCurrenciesCodes.SOL:
        cryptoCurrencyIcon = CryptoCurrenciesUnicodes.SOL;
        break;
    }

    return `<span class='fi tw-mr-0.5'>${cryptoCurrencyIcon}</span>${stringValue}`;
  }
}
