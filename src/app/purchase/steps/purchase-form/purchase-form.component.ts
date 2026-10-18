import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LicenseDTO } from '@csd-models/license.models';
import { UserDTO } from '@csd-models/user.models';
import { OrderDTO } from '@csd-models/order/order.models';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import { CsdOrderService } from '@csd-services/order.service';
import { UserDetailsService } from '@csd-services/user-details.service';
import { isUserDetailsComplete } from '@csd-utils/user-details.utils';
import { State } from '@csd-store/state';
import { selectUser } from '@csd-store/user/user.selectors';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  Observable,
  EMPTY,
  combineLatest,
  distinctUntilChanged,
  finalize,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';

@Component({
  selector: 'csd-purchase-form',
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CsdOrderService],
})
export class PurchaseFormComponent {
  readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  readonly requireUserDetails$ = this.prchService.owner$.pipe(
    map((owner) => !!owner?.require_user_details),
    distinctUntilChanged(),
  );

  readonly priceData$ = this.prchService.drop$.pipe(
    map((d) => ({ price: d.price, currency: d.currency })),
  );

  readonly loading$;

  private readonly _loading$ = new BehaviorSubject(false);

  constructor(
    private orderService: CsdOrderService,
    private prchService: PurchaseService,
    private store: Store<State>,
    private userDetailsService: UserDetailsService,
  ) {
    this.loading$ = combineLatest([
      this._loading$,
      this.orderService.loading$,
    ]).pipe(
      map(([loadingInner, loadingOrder]) => loadingOrder || loadingInner),
      distinctUntilChanged(),
    );

    this.setupEmailField();
  }

  onSubmit() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }
    this._loading$.next(true);

    this.prchService.drop$
      .pipe(
        take(1),
        switchMap((order) =>
          this.saveDetailsAndPurchase(order).pipe(
            map((data) =>
              this.orderService.isPaidOrder(order)
                ? null
                : (data as LicenseDTO),
            ),
          ),
        ),
        finalize(() => this._loading$.next(false)),
      )
      .subscribe({
        next: (license) => {
          if (license) {
            this.prchService.onLicenseReceive(license);
          }
        },
        error: () => {},
      });
  }

  /**
   * Saves the entered email to the profile for owners not requiring
   * details, gates paid orders on profile completeness, and performs
   * the purchase without an email in the order body. Free drops are
   * never gated.
   */
  private saveDetailsAndPurchase(order: OrderDTO) {
    return combineLatest([
      this.prchService.owner$,
      this.store.select(selectUser),
    ]).pipe(
      take(1),
      switchMap(([owner, user]) => {
        if (
          this.orderService.isPaidOrder(order) &&
          owner.require_user_details &&
          !isUserDetailsComplete(user)
        ) {
          return this.userDetailsService
            .openDetailsForm('full')
            .pipe(switchMap((saved) => (saved ? this.purchase(order) : EMPTY)));
        }

        const saveEmail$ = owner.require_user_details
          ? of(null)
          : this.saveEmailIfChanged(user);

        return saveEmail$.pipe(switchMap(() => this.purchase(order)));
      }),
    );
  }

  private purchase(order: OrderDTO) {
    return this.userDetailsService.retryOnUserDetailsRequired(
      this.orderService.postOrderData({}, order),
    );
  }

  private saveEmailIfChanged(user: UserDTO | null): Observable<unknown> {
    const email = this.form.value.email;

    if (!email || email === user?.email) {
      return of(null);
    }

    return this.userDetailsService.saveEmail(email);
  }

  /** The inline email field exists only for owners not requiring details. */
  private setupEmailField() {
    this.requireUserDetails$.subscribe((required) => {
      const email = this.form.get('email')!;

      email.setValidators(
        required ? [] : [Validators.required, Validators.email],
      );
      email.updateValueAndValidity();
    });
  }
}
