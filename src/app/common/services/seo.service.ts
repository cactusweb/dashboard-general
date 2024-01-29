import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ImagesPaths } from '@csd-consts/img.consts';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private title: Title, @Inject(DOCUMENT) private doc: Document) {}

  changeTitle(title: string) {
    this.title.setTitle(title);
  }

  changeIcon(url: string = ImagesPaths.LOGO_PNG) {
    let links: NodeListOf<HTMLLinkElement> = this.doc.head.querySelectorAll(
      'link[rel=icon], link[rel=apple-touch-icon]'
    );
    let baseUrl = environment.siteUrl;

    links.forEach((l) => l.setAttribute('href', `${baseUrl}${url}`));
    // this.doc.head.appendChild(link);
    // this.meta.updateTag({property: 'og:url', content: url});
    // this.meta.updateTag({name: 'icon', content: url });
  }
}
