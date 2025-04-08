import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Business } from './model/business-questions.model';
import { MetaService } from './services/meta-service.service';
import { BusinessDataService } from './services/business-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'adult-family-home';
  businessId!: string;
  business!: Business;
  isBrowser: boolean;

  constructor(
    private metaService: MetaService,
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    console.log('🧪 AppComponent - constructor');
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    console.log('🧪 AppComponent - ngOnInit');
    console.log('SSR SAFE: AppComponent initialized');
    // Subscribe to already-loaded business data (from APP_INITIALIZER)
    this.businessDataService.businessData$.subscribe((data) => {
      console.log('📦 AppComponent got businessData:', data);
      if (data) {
        this.business = data;

        this.metaService.updateMetaTags({
          title: data.metaTitle || data.businessName || 'Default Title',
          description: data.metaDescription || 'Adult Family Home providing quality care.',
          keywords: data.metaKeywords || 'adult care, Renton, Kent, Washington',
          image: data.metaImage || '/assets/default-og.jpg',
          url: data.businessURL || `https://${data.businessURL || 'defaultsite.com'}`,
        });
        console.log('✅ Meta tags updated from AppComponent');
      }
      else {
        console.error('❌ No business data found in AppComponent');
      }
    });

    // Optionally load browser-specific scripts
    if (this.isBrowser) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
      document.body.appendChild(script);
    }
  }
}
