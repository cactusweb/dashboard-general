import { DOCUMENT, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { ImagesPaths } from '@csd-consts/img.consts';
import { OwnerDTO } from '@csd-models/owner.models';
import { environment } from 'environment/environment';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly primaryThemeColor = '#3880EC';
  private readonly PLATFORM_ID = inject(PLATFORM_ID);

  constructor(
    private title: Title,
    @Inject(DOCUMENT) private doc: Document,
    private meta: Meta,
    private router: Router
  ) {}

  startMetaAutoChanger() {
    if (isPlatformServer(this.PLATFORM_ID)) {
      return;
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.changeTitle(this.title.getTitle());
        });
        this.setThemeColor(this.primaryThemeColor);
        this.changeIcon();
      });
  }

  setOwnerData(owner: OwnerDTO, page: 'Dashboard' | 'Purchase') {
    this.changeTitle(owner.name + ` - ${page} | CactusDash`);
    if (owner.avatar) {
      this.changeIcon(owner.avatar);
    }

    if (owner.primary_color) {
      this.setThemeColor(owner.primary_color);
    }
  }

  private changeTitle(title: string) {
    this.title.setTitle(title);

    const titles: NodeListOf<HTMLLinkElement> = this.doc.head.querySelectorAll(
      'meta[name=title], meta[property="og:title"]'
    );

    titles.forEach((t) => t.setAttribute('content', title));
  }

  private changeIcon(url: string = ImagesPaths.LOGO_PNG) {
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

  private updateSiteUrlTags() {
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

  private setThemeColor(color: string) {
    const themeColorTag: HTMLLinkElement = this.doc.head.querySelector(
      'meta[name="theme-color"]'
    )!;
    themeColorTag.setAttribute('content', color);
  }
}
