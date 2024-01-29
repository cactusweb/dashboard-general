import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Requests } from '@csd-consts/requests.consts';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { OrderDTO } from '@csd-models/order/order.models';
import { OwnerDTO } from '@csd-models/owner.models';
import { CsdSnackbarService } from '@csd-modules/snackbar/services/snackbar.service';
import { PurchaseRequests } from '@csd-purchase/consts/requests.consts';
import { PurchaseSteps } from '@csd-purchase/models/purchase.models';
import { HttpService } from '@csd-services/http/http.service';
import { SeoService } from '@csd-services/seo.service';
import { State } from '@csd-store/state';
import { Store } from '@ngrx/store';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  shareReplay,
  throwError,
} from 'rxjs';

@Injectable()
export class PurchaseService {
  readonly owner$;
  readonly drop$;
  readonly step$;

  private readonly ownerName = this.getOwnerName();
  private readonly _step$ = new BehaviorSubject(PurchaseSteps.STATUS);

  constructor(
    private store: Store<State>,
    private snackbar: CsdSnackbarService,
    private router: Router,
    private http: HttpService,
    private seo: SeoService
  ) {
    this.step$ = this._step$.asObservable().pipe(distinctUntilChanged());
    this.owner$ = this.getOwner();
    this.drop$ = this.getDropData();
  }

  changeStep(step: PurchaseSteps) {
    this._step$.next(step);
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

    return this.http
      .request<OrderDTO>(getReqData(), getReqBody())
      .pipe(shareReplay(1));
  }

  private getOwnerName() {
    return (
      inject(ActivatedRoute).snapshot.params['owner_name'] as string
    ).replace('-', ' ');
  }

  private getOwner() {
    return this.http
      .request<OwnerDTO>(Requests.GET_OWNER, null, this.ownerName)
      .pipe(
        catchError((err) => {
          if (err.error?.message === 'Owner not found') {
            this.router.navigate(['/' + RouterPaths.NOT_FOUND]);
          }
          return throwError(() => err);
        }),
        shareReplay(1)
      );
  }
}
