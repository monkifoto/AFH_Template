import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
  business: Business | null = null;
  businessId: string | null = null;

  constructor(
    private webContent: WebContentService,
    private route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService,
    private businessDataService: BusinessDataService
  ) {}

  navigateToContact() {
    this.router.navigate(['/contact-us'], { queryParams: { id: this.businessId } });
  }

  ngOnInit(): void {
    // Subscribe to business data from BusinessDataService
    this.businessDataService.businessData$.subscribe((business) => {
      this.business = business;
      this.businessId = business?.id || null;

      if (this.businessId) {
        // Update meta tags based on business data
        this.metaService.loadAndApplyMeta(this.businessId);
      }
    });
  }
}
