<<<<<<< HEAD
import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Business } from './model/business-questions.model';
import { MetaService } from './services/meta-service.service';
import { BusinessDataService } from './services/business-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // template: '<p>This is the app.component.html comented out template.</p>',
  styleUrls: ['./app.component.css'],
=======
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from './services/meta-service.service';
import { WebContentService } from './services/web-content.service';
import { Business } from './model/business-questions.model';
import { ThemeService } from './services/theme-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    standalone: false
})
export class AppComponent implements OnInit {
  title = 'adult-family-home';
  businessId!: string;
  business!: Business;
<<<<<<< HEAD
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
      // console.log('📦 AppComponent got businessData:', data);
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
=======

  constructor(
    private route: ActivatedRoute,
    private webContent: WebContentService,
    private metaService: MetaService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.businessId = params.get('id') || 'MGou3rzTVIbP77OLmZa7'; // Fallback if undefined
      this.loadBusinessData();
    });
      // this.loadBusinessData();
  }

  // Fetch business data
  loadBusinessData() {
    this.webContent.getBusinessData(this.businessId).subscribe((data) => {
      if (data) {
        this.business = data;
      }
    });
  }

>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
}
