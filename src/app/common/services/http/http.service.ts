import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpRequestData } from './http.models';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  request<Response>(
    reqParams: HttpRequestData,
    body: any = '',
    urlParam: string = '',
    urlQuery: string = ''
  ): Observable<Response> {
    let reqUrl =
      environment.apiUrl + reqParams.url.replace(':param', urlParam) + urlQuery;

    switch (reqParams.method) {
      case 'POST':
        return this.postHttp(reqUrl, body);
      case 'GET':
        return this.getHttp(reqUrl);
      case 'DELETE':
        return this.deleteHttp(reqUrl);
      case 'PUT':
        return this.putHttp(reqUrl, body);
      case 'PATCH':
        return this.patchHttp(reqUrl, body);
      default:
        return throwError(() => 'Method is not defined');
    }
  }

  private postHttp<Response>(url: string, data: Record<string, any>) {
    return this.http.post<Response>(url, data);
  }

  private getHttp<Response>(url: string) {
    return this.http.get<Response>(url);
  }

  private putHttp<Response>(url: string, data: Record<string, any>) {
    return this.http.put<Response>(url, data);
  }

  private deleteHttp<Response>(url: string) {
    return this.http.delete<Response>(url);
  }

  private patchHttp<Response>(url: string, data: Record<string, any>) {
    return this.http.patch<Response>(url, data);
  }
}
