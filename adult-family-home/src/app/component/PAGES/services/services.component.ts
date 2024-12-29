import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { MetaService } from 'src/app/services/meta-service.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit {
  business: Business | null = null;
  businessId: string | null = null;

  constructor(
    private router: Router,
    private businessDataService: BusinessDataService,
    private metaService: MetaService
  ) {}

  navigateToContact(): void {
    if (this.businessId) {
      this.router.navigate(['/contact-us'], { queryParams: { id: this.businessId } });
    }
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
