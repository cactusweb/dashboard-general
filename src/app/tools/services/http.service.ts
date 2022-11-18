import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Req } from '../interfaces/req-map';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  
  request( reqParams: Req, body: any = '', urlParam: string = '', urlQuery: string = '' ): Observable<any>{
    let reqUrl = this.url + reqParams.url;

    reqUrl = reqUrl.replace( ':param', urlParam ) + urlQuery;

    switch ( reqParams.method ){
      case "POST": return this.postHttp( reqUrl, body );
      case "GET": return this.getHttp( reqUrl );
      case "DELETE": return this.deleteHttp( reqUrl );
      case "PUT": return this.putHttp( reqUrl, body );
      default: return this.getHttp( reqUrl )
    }
  }

  private postHttp( url: string, data: Record< string, any > ){
    return this.http.post( url, data );
  }

  private getHttp( url: string ){
    return this.http.get( url );
  }

  private putHttp( url: string, data: Record< string, any > ){
    return this.http.put( url, data );
  }

  private deleteHttp( url: string ){
    return this.http.delete( url );
  }
}
