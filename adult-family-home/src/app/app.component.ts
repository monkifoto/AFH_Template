import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from './services/meta-service.service';
import { WebContentService } from './services/web-content.service';
import { Business } from './model/business-questions.model';
import { ThemeService } from './services/theme-service.service';
import { isPlatformBrowser } from '@angular/common';

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

  constructor(
    private route: ActivatedRoute,
    private webContent: WebContentService,
    private metaService: MetaService,
    private router: Router,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.paramMap.subscribe(params => {
        this.businessId = params.get('id') || 'MGou3rzTVIbP77OLmZa7';
        this.loadBusinessData();
      });

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
      document.body.appendChild(script);
    }
  }

  // Fetch business data
  loadBusinessData() {
    this.webContent.getBusinessData(this.businessId).subscribe((data) => {
      if (data) {
        this.business = data;


          this.metaService.updateMetaTags({
            title: data.metaTitle || data.businessName || 'Default Title',
            description: data.metaDescription || 'Adult Family Home providing quality care.',
            keywords: data.metaKeywords || 'adult care, Renton, Kent, Washington',
            image: data.metaImage || '/assets/default-og.jpg',
            url: data.businessURL || `https://${data.businessURL || 'defaultsite.com'}`
          });
      }
    });
  }

}
