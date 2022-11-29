import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, finalize, map, Observable, take, tap, throwError } from 'rxjs';
import { Requests } from 'src/app/const';
import { License } from 'src/app/license-list/interfaces/license';
import { LicenseOwner } from 'src/app/license-list/interfaces/license-owner';
import { Req } from 'src/app/tools/interfaces/req-map';
import { HttpService } from 'src/app/tools/services/http.service';
import { SeoService } from 'src/app/tools/services/seo.service';
import { ToolsService } from 'src/app/tools/services/tools.service';
import { Order } from '../interfaces/order';

@Injectable()
export class PurchaseService {
  private drop: Order|undefined;
  public owner: LicenseOwner|undefined;

  private loading: boolean = false;
  
  public $purchaseState = new BehaviorSubject<'btn' | 'form' | 'payment' | 'status-failed' | 'status-success' | 'status-payment-failed' | 'status-check' | 'crypto-payment'>('btn')

  public purchasedLicense: License|undefined

  constructor(
    private http: HttpService,
    private activatedRoute: ActivatedRoute,
    private tools: ToolsService,
    private router: Router,
    private seo: SeoService,
    private title: Title
  ) { }

  getDrop(): Observable<Order>{
    if ( this.drop ) 
      return new BehaviorSubject<Order>(this.drop)

    this.loading = true;

    return this.http.request( this.getDropAuthReq(), this.getDropAuthBody() )
            .pipe(
              take(1),
              finalize(() => this.loading = false),
              tap(d => this.drop = d)
            )
  }

  
  private getDropAuthReq(): Req{
    return this.activatedRoute.snapshot.queryParams['referral_code'] ?
      Requests['getReferral']
    :
      Requests['getDrop'];
  }

  private getDropAuthBody( ){
    return {
      owner_name: this.getOwnerName(),
      password: this.activatedRoute.snapshot.queryParams['password'],   
      code: this.activatedRoute.snapshot.queryParams['referral_code']   
    }
  }

  
  private getOwnerName(): string{
    return this.tools.replaceSymbol(
      this.activatedRoute.snapshot.params['ownerName'],
      '-',
      ' '
    )
  }

  getOwner(): Observable<LicenseOwner>{
    if ( this.owner )
      return new BehaviorSubject<LicenseOwner>(this.owner).asObservable();

    return this.http.request( Requests['getOwner'], null, this.getOwnerName() )
      .pipe(
        tap(d => this.owner = d),
        tap(d => {
          this.seo.changeIcon(d.avatar)
          this.title.setTitle(`${d.name} - Purchase`)
        }),
        catchError(err => {
          if ( err?.error?.message && err.error.message == 'Owner not found' )
            this.router.navigate(['/licenses'])
          return throwError(err)
        }),
      )
  }



  freePurchase(email: string): Observable<License>{
    if ( !this.drop ){
      this.$purchaseState.next('status-payment-failed')
      this.tools.generateNotification('Drop is undefined', 'err')
      return throwError({ message: "Drop is undefined" })
    }

    return this.http.request( Requests['purchaseFree'], { email }, this.drop.id )
      .pipe(
        tap(d => this.$purchaseState.next('status-success')),
        map((l: License) => {
          return { ...l, expires_in: l.expires_in*1000, bought_at: l.bought_at*1000, created_at: l.created_at*1000 }
        }),
        tap(d => this.purchasedLicense = d),
        catchError(err => {
          this.$purchaseState.next('status-failed')
          return throwError(err)
        })
      )
  }


  getLicense(){
    return this.http.request(Requests['getLicense'], null, this.getOwnerName())
      .pipe(
        tap(d => this.$purchaseState.next('status-success')),
        map((l: License) => {
          return { ...l, expires_in: l.expires_in*1000, bought_at: l.bought_at*1000, created_at: l.created_at*1000 }
        }),
        tap(d => this.purchasedLicense = d),
      )
  }

}
