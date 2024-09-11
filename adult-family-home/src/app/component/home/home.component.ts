import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';

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
    keyWords: '',
    tagline: '',
    uniqueService: [],
    whyChoose: [],
    businessStory: '',
    motivation: '',
    mission: '',
    vision: '',
    certifications: '',
    targetAudience: '',
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
    pricingStructure: '',
    contactFormDetails: '',
    mapDirections: '',
    photoGalleryText: '',
    employees: [],
    id: '',
    faqs: '',
    blogNews: '',
    mapIframe: '',
    isActive: false
  };


  constructor(private webContent: WebContentService, private route: ActivatedRoute,  private metaService: MetaService){}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      let businessId = params['id'] ;

      this.metaService.getMetaData(businessId).subscribe((metaData: { title: string; description: string; keywords: string; }) => {
        console.log("Metadata", metaData);
        this.metaService.updateMetaTags(metaData);
      });

      this.webContent.getBusinessData(businessId).subscribe(data => {
        if(data)
        this.business = data;
      });
    });
  }

}
