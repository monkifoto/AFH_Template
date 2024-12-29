import { Component, OnInit } from '@angular/core';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { Business } from 'src/app/model/business-questions.model';
import { MetaService } from 'src/app/services/meta-service.service';

@Component({
  selector: 'app-testimonials-list',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsListComponent implements OnInit {
  testimonials: { name: string; quote: string }[] = [];
  themeType: string | null = null;

  constructor(private businessDataService: BusinessDataService, private metaService: MetaService,) {}

  ngOnInit(): void {
    // Subscribe to business data
    this.businessDataService.businessData$.subscribe((business: Business | null) => {
      console.log("Testimonial List - :", business);
      if (business) {

        this.testimonials = business.testimonials || [];
        this.themeType = business.theme.themeType;
          // Update meta tags based on business data
          this.metaService.loadAndApplyMeta(business?.id);
      }
    });
  }
}
