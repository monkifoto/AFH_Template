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

}
