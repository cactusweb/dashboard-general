import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, take, tap } from 'rxjs';
import { Requests } from 'src/app/const';
import { HttpService } from 'src/app/tools/services/http.service';
import { ToolsService } from 'src/app/tools/services/tools.service';
import { License } from '../interfaces/license';

@Injectable({
  providedIn: 'root'
})
export class LicensesService {
  private _licenses!: License[]
  private get licenses(): License[]{
    return this._licenses;
  }
  private set licenses(val: License[]){
    this._licenses = val;
    this.$licenses.next(val);
  }

  private $licenses = new BehaviorSubject<License[]|null>(null)

  constructor(
    private http: HttpService,
    private tools: ToolsService,
    private router: Router
  ) { }

  getLicenses( fetch: boolean = false ): Observable<License[]>{
    if ( fetch || !this.licenses )
      this.fetchLicenses();

    // @ts-ignore
    return this.$licenses.asObservable()
      .pipe(
        filter(data => !!data)
      )
  }

  bindLicense( data: { key: string } ): Observable<License>{
    return (this.http.request(Requests['bindLicense'], data) as Observable<License>)
      .pipe(
        map(d => this.mapLicense(d)),
        tap(() => this.tools.generateNotification('Licenses binded', 'success')),
        tap(d => {
          let data = this.licenses;
          data.push(d);
          this.licenses = data;
        }),
        tap(d => this.router.navigate([`/${this.tools.replaceSymbol(d.owner.name)}/dashboard`])),
      )
  }

  private fetchLicenses(){
    (this.http.request(Requests['getLicenses']) as Observable<License[]>)
      .pipe(
        take(1),
        filter(d => JSON.stringify(d) != JSON.stringify(this.licenses)),
        map(ls => ls.map(l => this.mapLicense(l))),
      )
      .subscribe({
        next: v => this.licenses = v,
        error: err => {}
      })
  }

  private mapLicense(lic: License): License{
    return {
      ...lic,
      expires_in: lic.expires_in*1000, 
      bought_at: lic.bought_at*1000, 
      created_at: lic.created_at*1000
    }
  }

  public putLicenses( callback: (licenses:License[]) => License[] ){
    let licenses = this.licenses;
    this.licenses = callback(licenses)
  }

}
