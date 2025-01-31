import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { Business } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  businessId: string = '';
  business: Business | null = null; // Set to null initially
  business$ = this.businessDataService.businessData$;

  constructor(
    private route: ActivatedRoute,
    private metaService: MetaService,
    private businessDataService: BusinessDataService
  ) {}

  ngOnInit(): void {
    console.log('HomeComponent - ngOnInit');

     // Subscribe to the businessId from the service
     this.businessDataService.getBusinessId().subscribe((businessId) => {
      if (businessId) {
        this.businessId = businessId;
        this.businessDataService.getBusinessData().subscribe((data) => {
          this.business = data;
        });
          // Update meta tags based on business data
          this.metaService.loadAndApplyMeta(this.businessId);
      }
    });
  }

  getSectionByName(sectionName: string) {
    return this.business?.sections?.find(section => section.sectionName === sectionName) || null;
  }
}
