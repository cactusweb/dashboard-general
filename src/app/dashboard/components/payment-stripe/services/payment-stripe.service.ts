import { Injectable } from '@angular/core';
import { HttpService } from '@csd-services/http/http.service';
import {
  HttpStripeRequestNames,
  StripeRequests,
} from '../consts/stripe-requests.const';
import {
  BehaviorSubject,
  Observable,
  catchError,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { DashboardService } from '@csd-dashboard/services/dashboard.service';

@Injectable()
export class PaymentStripeService {
  readonly loading$;
  private readonly _loading$ = new BehaviorSubject(false);

  constructor(
    private dashService: DashboardService,
    private http: HttpService
  ) {
    this.loading$ = this._loading$.asObservable();
  }

  createPortal() {
    this.sendRequest(HttpStripeRequestNames.CREATE_PORTAL);
  }

  goToPortal() {
    this.sendRequest(HttpStripeRequestNames.GET_PORTAL);
  }

  private sendRequest(request: HttpStripeRequestNames) {
    this._loading$.next(true);
    this.dashService.ownerName$
      .pipe(
        take(1),
        switchMap((ownerName) =>
          this.http.request<{ url: string }>(
            StripeRequests[request],
            null,
            ownerName
          )
        ),
        this.handleRes()
      )
      .subscribe({
        error: () => {},
      });
  }

  private handleRes() {
    return (source: Observable<{ url: string }>) =>
      source.pipe(
        tap((d) => (window.location.href = d.url)),
        catchError((err) => {
          this._loading$.next(false);
          return throwError(() => err);
        })
      );
  }
}
