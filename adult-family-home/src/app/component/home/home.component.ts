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

    // Check if business data is already available
    // this.businessDataService.businessData$.subscribe((data) => {
    //   console.log('HomeComponent - Business data received from service:', data);
    //   if (data) {
    //     console.log('HomeComponent - Using cached business data:', data);
    //     this.business = data; // Use cached data
    //   } else {
    //     // If no cached data, load new data based on query params
    //     console.warn('HomeComponent - Business data is null');
    //     this.route.queryParams.subscribe((params) => {
    //       const businessId = params['id'];

    //       console.log('HomeComponent - Loading business data for ID:', businessId);

    //       // Load metadata
    //       this.metaService.getMetaData(businessId).subscribe((metaData) => {
    //         this.metaService.updateMetaTags(metaData);
    //       });

    //       // Load business data from service
    //       this.businessDataService.loadBusinessData(businessId).subscribe((data) => {
    //         console.log('HomeComponent - Loaded business data:', data);
    //         this.business = data;
    //       });
    //     });
    //   }
    // });

     // Subscribe to the businessId from the service
     this.businessDataService.getBusinessId().subscribe((businessId) => {
      if (businessId) {
        this.businessId = businessId;
        this.businessDataService.getBusinessData().subscribe((data) => {
          this.business = data;
        });
      }
    });
  }
}
