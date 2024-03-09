import { Injectable, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Requests } from '@csd-consts/requests.consts';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { LicenseDTO } from '@csd-models/license.models';
import { OrderDTO } from '@csd-models/order/order.models';
import { OwnerDTO } from '@csd-models/owner.models';
import { PurchaseRequests } from '@csd-purchase/consts/requests.consts';
import { IPurchaseSteps } from '@csd-purchase/models/purchase.models';
import { HttpService } from '@csd-services/http/http.service';
import { SeoService } from '@csd-services/seo.service';
import { AddLicense } from '@csd-store/licenses/licenses.actions';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  ReplaySubject,
  catchError,
  distinctUntilChanged,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';

@Injectable()
export class PurchaseService implements OnDestroy {
  readonly owner$;
  readonly drop$;
  readonly step$;
  readonly receivedLicense$;

  private readonly _receivedLicense$ = new ReplaySubject<LicenseDTO>();
  private readonly ownerName = this.getOwnerName();
  private readonly _step$ = new BehaviorSubject(IPurchaseSteps.STATUS);

  constructor(
    private store: Store<State>,
    private router: Router,
    private seo: SeoService
  ) {
    this.step$ = this._step$.asObservable().pipe(distinctUntilChanged());
    this.owner$ = this.getOwner();
    this.drop$ = this.getDropData();
    this.receivedLicense$ = this._receivedLicense$
      .asObservable()
      .pipe(shareReplay());
    this.checkAndChangeStep();
  }

  ngOnDestroy(): void {
    this._step$.complete();
    this._receivedLicense$.complete();
  }

  changeStep(step: IPurchaseSteps) {
    this._step$.next(step);
  }

  onLicenseReceive(lic: LicenseDTO) {
    const license = {
      ...lic,
      expires_in: lic.expires_in ? lic.expires_in * 1000 : lic.expires_in,
      created_at: lic.created_at * 1000,
      bought_at: lic.bought_at * 1000,
    };

    this._receivedLicense$.next(license);
    this.store.dispatch(new AddLicense(license));
    this._step$.next(IPurchaseSteps.SUCCESS);
  }

  private getDropData() {
    const queryParams = inject(ActivatedRoute).snapshot.queryParams;
    const getReqData = () =>
      queryParams['referral_code']
        ? PurchaseRequests.AUTH_REFERRAL
        : PurchaseRequests.AUTH_DROP;

    const getReqBody = () => ({
      owner_name: this.ownerName,
      password: queryParams['password'],
      code: queryParams['referral_code'],
    });

    return inject(HttpService)
      .request<OrderDTO>(getReqData(), getReqBody())
      .pipe(shareReplay(1));
  }

  private getOwnerName() {
    return (
      inject(ActivatedRoute).snapshot.params['owner_name'] as string
    ).replace('-', ' ');
  }

  private getOwner() {
    return inject(HttpService)
      .request<OwnerDTO>(Requests.GET_OWNER, null, this.ownerName)
      .pipe(
        catchError((err) => {
          if (err.error?.message === 'Owner not found') {
            this.router.navigate(['/' + RouterPaths.NOT_FOUND]);
          }
          return throwError(() => err);
        }),
        tap((owner) => {
          this.seo.setOwnerData(owner, 'Purchase');
        }),
        shareReplay(1)
      );
  }

  private checkAndChangeStep() {
    const status = inject(ActivatedRoute).snapshot.queryParams['status'];

    if (status === 'pending') {
      this.changeStep(IPurchaseSteps.CHECK_RESULT);
    } else if (status === 'payment-failed') {
      this.changeStep(IPurchaseSteps.FAILED);
    }
  }
}
