import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImagesPaths } from '@csd-consts/img.consts';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(
    private title: Title,
    @Inject(DOCUMENT) private doc: Document,
    private meta: Meta,
    private router: Router
  ) {}

  changeTitle(title: string) {
    this.title.setTitle(title);

    const titles: NodeListOf<HTMLLinkElement> = this.doc.head.querySelectorAll(
      'meta[name=title], meta[property="og:title"]'
    );

    titles.forEach((t) => t.setAttribute('content', title));
  }

  changeIcon(url: string = ImagesPaths.LOGO_PNG) {
    const links: NodeListOf<HTMLLinkElement> = this.doc.head.querySelectorAll(
      'link[rel=icon], link[rel=apple-touch-icon]'
    );

    if (url[0] === '.') {
      url = url.replace('.', '');
    }

    links.forEach((l) =>
      l.setAttribute('href', `${environment.siteUrl}${url}`)
    );

    this.updateSiteUrlTags();
  }

  updateSiteUrlTags() {
    const siteUrl = environment.siteUrl + this.router.url;

    this.meta.updateTag({
      property: 'og:url',
      content: siteUrl,
    });
    this.meta.updateTag({
      name: 'url',
      content: siteUrl,
    });
  }
}
