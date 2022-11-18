import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, tap, filter, BehaviorSubject, take, finalize } from 'rxjs';
import { Requests } from 'src/app/const';
import { License } from 'src/app/license-list/interfaces/license';
import { ReferralPrize, ReferralPrizes } from 'src/app/license-list/interfaces/referral-prize';
import { LicensesService } from 'src/app/license-list/services/licenses.service';
import { HttpService } from 'src/app/tools/services/http.service';
import { SeoService } from 'src/app/tools/services/seo.service';
import { ToolsService } from 'src/app/tools/services/tools.service';

@Injectable()
export class DashboardService {
  private ownerName: string = '';

  private licenseLoading: boolean = false;
  private redirected: boolean = false;

  private _license: License|null = null;
  private get license(): License|null{
    return this._license;
  }
  private set license(val: License|null){
    this._license = val;
    this.$license.next(val)
  }

  private $license = new BehaviorSubject<License|null>(null)

  constructor(
    private licenses: LicensesService,
    private router: Router,
    private tools: ToolsService,
    private http: HttpService,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private seo: SeoService
  ) {
  }

  getLicense(): Observable<License>{
    if ( !this.license && !this.licenseLoading )
      this.fetchLicense();
      
    // @ts-ignore
    return this.$license.asObservable()
      .pipe(filter(d => !!d))
  }

  resetLicense(  ): Observable<License>{
    return this.http.request( Requests['resetLicense'], null, this.ownerName )
      .pipe(
        map(d => this.mapLicense(d)),
        tap(d => this.licenses.putLicenses(licenses => licenses.map(lc => {
            return lc.id == d.id ? d : lc;
        }))),
        tap(d => this.license = d),
        tap(d => this.tools.generateNotification('Activations reseted', 'success'))
      )
  }

  joinServer(): Observable<{ url: string }>{
    return this.http.request( Requests['joinServer'], null, this.ownerName )
      .pipe(
        tap(d => this.tools.generateNotification('Joined to discord server', 'success')),
      )
  }

  unbindLicense(){
    return this.http.request( Requests['unbindLicense'], null, this.ownerName )
      .pipe(
        tap(() => this.licenses.putLicenses(licenses => licenses.filter( l => l.id !== this.license?.id ))),
        tap(() => this.tools.generateNotification('Licenses unbinded', 'err')),
        tap(() => this.router.navigate(['/licenses']))
      )
  }

  setOwnerName(  ){
    this.ownerName = this.tools.replaceSymbol(
      this.activatedRoute.snapshot.params['ownerName'],
      '-',
      ' '
    )

    setTimeout(() => {
      this.title.setTitle(`${this.ownerName} - Dashboard`)
    }, 10);
  }

  private fetchLicense(){
    this.licenseLoading = true;
    this.licenses.getLicenses()
      .pipe(
        map(d => d.find(l => l.owner.name == this.ownerName)),
        tap(l => {
          if ( l || this.redirected) return;
          this.redirected = true;
          this.tools.generateNotification(`License of ${this.ownerName} is not found`, 'err')
          this.router.navigate(['/licenses']);
        }),
        tap(l => {
          this.seo.changeIcon(l?.owner.avatar)
          if ( l )
            this.title.setTitle(`${l.owner.name} - Dashboard`)
        }),
        take(1),
        finalize(() => this.licenseLoading = false)
      )
      .subscribe({
        next: v => v ? this.license = v : this.resetData(),
        error: () => {}
      })
  }

  getReferral(): Observable<ReferralPrize[]>{
    return (this.http.request(Requests['getReferralPrizes'], null, this.ownerName) as Observable<ReferralPrizes>)
      .pipe(map(d => d.prizes))
  }

  resetData(){
    this.license = null;
    this.ownerName = '';
    this.seo.changeIcon();
  }

  
  private mapLicense(lic: License): License{
    return {
      ...lic,
      expires_in: lic.expires_in*1000, 
      bought_at: lic.bought_at*1000, 
      created_at: lic.created_at*1000
    }
  }
}
