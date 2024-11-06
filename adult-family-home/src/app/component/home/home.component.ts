import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  business: Business = {
    // Provide default values for the properties if needed
    businessName: '',
    businessURL: '',
    providerName:'',
    keyWords: '',
    tagline: '',
    uniqueService: [],
    whyChoose: [],
    businessStory: '',
    motivation: '',
    missionImageUrl:'',
    mission: '',
    visionImageUrl:'',
    vision: '',
    certifications: '',
    services: [],
    specialPrograms: '',
    tours: '',
    freeConsulting: '',
    websiteGoals: '',
    logoImage: '',
    ownerImagesBios: '',
    staffImagesBios: '',
    facilityImages: [],
    lifestyleImages: [],
    mediaFeatures: '',
    ratings: '',
    testimonials: [],
    address: '',
    phone: '',
    fax: '',
    email: '',
    businessHours: '',
    socialMedia: '',
    welcomeMessage: '',
    keyServicesHighlights: '',
    teamValues: '',
    benefits: [],
    contactFormDetails: '',
    mapIframeUrl: '',
    photoGalleryText: '',
    employees: [],
    id: '',
    faqs: '',
    blogNews: '',
    isActive: false,
    contactUsImageUrl: '',
  toursImageUrl: '',
  consultingImageUrl:'',

  theme: {
    backgroundColor: '',
    primaryColor: '',
    secondaryColor: '',
    textColor: '',
    accentColor: '',
    darkBackgroundColor: '',
    navBackgroundColor: '',
    navTextColor: '',
    navActiveBackground: '',
    navActiveText: '',
    buttonColor: '',
    buttonHoverColor: '',
  }
  };
  business$ = this.businessDataService.businessData$;

  constructor(private webContent: WebContentService, private route: ActivatedRoute,  private metaService: MetaService, private businessDataService: BusinessDataService){}

  ngOnInit(): void {

    console.log("Home component ngOnInit");
    this.route.queryParams.subscribe(params => {
      const businessId = params['id'];

      // Load metadata
      this.metaService.getMetaData(businessId).subscribe(metaData => {
        this.metaService.updateMetaTags(metaData);
      });

      // Load business data through BusinessDataService
      this.businessDataService.loadBusinessData(businessId).subscribe(data => {
        console.log('Home comonent businessDataService data:', data);
        if (data) {
          this.business = data;
        }
      });
    });

  }

}
