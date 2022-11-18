import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  
  autoUpdateTags(){
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data)
     )
     .subscribe((event) => {
       this.changeTitle( event['title'] );
     }); 
  }

  
  changeTitle( title: string ){
    this.title.setTitle( 'CactusDash - ' + title );
  }
  
  changeIcon(url: string = 'assets/logo.png'){
    let links: NodeListOf<HTMLLinkElement> = this.doc.head.querySelectorAll('link[rel=icon], link[rel=apple-touch-icon]')
    let baseUrl = 'https://dashboard.cactusweb.io/'

    links.forEach(l => l.setAttribute('href', `${baseUrl}${url}`))
    // this.doc.head.appendChild(link);
    // this.meta.updateTag({property: 'og:url', content: url});
    // this.meta.updateTag({name: 'icon', content: url });
  }
}
