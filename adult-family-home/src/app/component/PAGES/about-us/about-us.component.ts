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
  businessId: string = '';

  constructor(
    private webContent: WebContentService,
    private route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService,
    private businessDataService: BusinessDataService
  ) {}

  navigateToContact(id: string | null | undefined) {
    //console.log('navigateToContact id', id);
    this.router.navigate(['/contact-us'], { queryParams: { id } });
  }

  ngOnInit(): void {
    // Subscribe to business data from the BusinessDataService
    this.businessDataService.getBusinessData().subscribe(data => {
      this.business = data; // Update the local business property
    });

    // Optionally, get business ID from the query string or use the service to set it
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'] || ''; // Set businessId from the query params
    });

    // Fetch and update the meta tags
    this.metaService.getMetaData(this.businessId).subscribe(metaData => {
      this.metaService.updateMetaTags(metaData);
    });
  }
}
