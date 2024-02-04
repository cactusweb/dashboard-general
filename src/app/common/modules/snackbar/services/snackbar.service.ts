import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';
import {
  CsdSnackbarItem,
  CsdSnackbarLevels,
} from '../interfaces/snackbar-item.models';

@Injectable()
export class CsdSnackbarService {
  private readonly _items$ = new BehaviorSubject<CsdSnackbarItem[]>([]);
  private readonly showTime = 3800;

  items$ = this._items$.asObservable().pipe(shareReplay());

  /**
   * @returns {() => void} Function for removing created item
   */
  createItem(text: string, level: CsdSnackbarLevels) {
    const items = this._items$.value;
    const id = Math.random();

    const timeout = setTimeout(() => {}, this.showTime);
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
