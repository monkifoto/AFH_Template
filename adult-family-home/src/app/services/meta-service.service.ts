import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BusinessDataService } from './business-data.service';
import { Business } from '../model/business-questions.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title,
    private businessDataService: BusinessDataService
  ) {}

  updateMetaTags(metaData: { title: string; description: string; keywords: string }) {
    this.title.setTitle(metaData.title);
    this.meta.updateTag({ name: 'description', content: metaData.description });
    this.meta.updateTag({ name: 'keywords', content: metaData.keywords });
    this.meta.updateTag({ property: 'og:title', content: metaData.title });
    this.meta.updateTag({ property: 'og:description', content: metaData.description });
  }

  updateFavicon(faviconUrl: string) {
    const head = document.getElementsByTagName('head')[0];
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      head.appendChild(link);
    }

    link.href = faviconUrl;
  }

  loadAndApplyMeta(businessId: string): void {
    this.businessDataService.loadBusinessData(businessId).subscribe((business: Business | null) => {
      if (business) {
        // Update meta tags
        const metaData = {
          title: business.metaTitle || 'Default Title',
          description: business.metaDescription || 'Default Description',
          keywords: business.metaKeywords || 'default, keywords',
        };
        this.updateMetaTags(metaData);

        // Update favicon if available
        if (business.faviconUrl) {
          this.updateFavicon(business.faviconUrl);
        }
      } else {
        console.warn('MetaService: No business data found for the given ID.');
      }
    });
  }
}
