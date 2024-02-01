import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Requests } from '@csd-consts/requests.consts';
import { LicenseDTO } from '@csd-models/license.models';
import { PurchaseSteps } from '@csd-purchase/models/purchase.models';
import { PurchaseService } from '@csd-purchase/services/purсhase.service';
import { HttpService } from '@csd-services/http/http.service';
import {
  Subject,
  catchError,
  interval,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';

@Component({
  selector: 'csd-purchase-check-results',
  templateUrl: './purchase-check-results.component.html',
  styleUrls: ['./purchase-check-results.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PurchaseCheckResults implements OnInit, OnDestroy {
  private readonly _intervalDestoyer$ = new Subject<void>();

  constructor(
    private http: HttpService,
    private prchService: PurchaseService
  ) {}

  ngOnInit(): void {
    interval(1000)
      .pipe(
        takeUntil(this._intervalDestoyer$),
        map((emitIndex) => {
          if (emitIndex === 4) {
            return true;
          }
          return false;
        }),
        switchMap((completeInterval) => this.fetchLicense(completeInterval))
      )
      .subscribe({
        error: () => {},
      });
  }

  ngOnDestroy(): void {
    this.completeInterval();
  }

  private completeInterval() {
    this._intervalDestoyer$.next();
    this._intervalDestoyer$.complete();
  }

  private fetchLicense(completeInterval: boolean = false) {
    return this.prchService.owner$.pipe(
      map((owner) => owner.name),
      switchMap((ownerName) => {
        if (completeInterval) {
          this.completeInterval();
        }
        return this.http.request<LicenseDTO>(
          Requests.GET_LICENSE_BY_OWNER,
          null,
          ownerName,
          '',
          false
        );
      }),
      tap((license) => {
        this.prchService.onLicenseReceive(license);
      }),
      catchError(() => {
        if (!this._intervalDestoyer$.observed) {
          this.prchService.changeStep(PurchaseSteps.FAILED);
        }
        return of();
      })
    );
  }
}
