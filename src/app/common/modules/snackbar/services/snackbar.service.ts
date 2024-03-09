import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';
import {
  CsdSnackbarItem,
  CsdSnackbarLevels,
} from '../interfaces/snackbar-item.models';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class CsdSnackbarService {
  private readonly _items$ = new BehaviorSubject<CsdSnackbarItem[]>([]);
  private readonly showTime = 3800;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  items$ = this._items$.asObservable().pipe(shareReplay());

  /**
   * @returns {() => void} Function for removing created item
   */
  createItem(text: string, level: CsdSnackbarLevels) {
    const items = this._items$.value;
    const id = Math.random();

    let timeout: any;
    if (this.isBrowser) {
      timeout = setTimeout(() => this.removeItem(id), this.showTime);
    }
    const removeFn = this.removeItem.bind(this, id, timeout);

    this._items$.next([...items, { text, level, id, closeFn: removeFn }]);

    return removeFn;
  }

  removeItem(itemId: number, timeout?: any) {
    clearTimeout(timeout);
    const items = this._items$.value.filter((item) => item.id !== itemId);
    this._items$.next(items);
  }
}
