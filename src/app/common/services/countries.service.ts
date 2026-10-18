import { Injectable } from '@angular/core';
import { Requests } from '@csd-consts/requests.consts';
import { HttpService } from '@csd-services/http/http.service';
import { map, shareReplay } from 'rxjs';

interface CountriesDTO {
  countries: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  readonly countries$ = this.http
    .request<CountriesDTO>(Requests.GET_COUNTRIES)
    .pipe(
      map((res) => res.countries),
      shareReplay(1)
    );

  constructor(private http: HttpService) {}
}
