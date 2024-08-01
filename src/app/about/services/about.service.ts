import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Requests } from '@csd-consts/requests.consts';
import { RouterPaths } from '@csd-consts/router-paths.conts';
import { OwnerDTO } from '@csd-models/owner.models';
import { HttpService } from '@csd-services/http/http.service';
import { SeoService } from '@csd-services/seo.service';
import { catchError, shareReplay, tap, throwError } from 'rxjs';
import { AboutDTO } from '../models/about.models';
import { GET_ABOUT } from '../consts/about.requests';

@Injectable()
export class AboutService {
  readonly owner$;
  readonly about$;

  private readonly ownerName = this.getOwnerName();

  constructor(private router: Router, private seo: SeoService) {
    this.owner$ = this.getOwner();
    this.about$ = this.getAbout();
  }

  private getAbout() {
    return inject(HttpService)
      .request<AboutDTO>(GET_ABOUT, null, this.ownerName)
      .pipe(
        tap((about) => this.seo.updateDescription(about.description)),
        shareReplay(1)
      );
  }

  private getOwnerName() {
    return (
      inject(ActivatedRoute).snapshot.params['owner_name'] as string
    ).replaceAll('-', ' ');
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
          this.seo.setOwnerData(owner, 'About');
        }),
        shareReplay(1)
      );
  }
}
