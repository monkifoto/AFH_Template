import { Component, OnInit } from '@angular/core';
import { Business } from 'src/app/model/business-questions.model';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';

declare var google: any;
@Component({
  selector: 'app-testimonials-list',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsListComponent implements OnInit {
  testimonials: any[] = [];
  themeType: string | null = null;
  business: Business | null = null;
  constructor(private businessDataService: BusinessDataService, private metaService: MetaService, private googleMapsLoader: GoogleMapsLoaderService) {}

  ngOnInit(): void {
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        this.business = data;
    }
  });
    this.loadTestimonials();
    if (this.business?.placeId != '0') {
      this.loadGoogleReviews();
    }
  }

  private loadTestimonials(): void {
    this.businessDataService.loadBusinessData(this.business?.id || '').subscribe((business) => {
      if (business && business.testimonials) {
        const formattedTestimonials = business.testimonials.map((testimonial: any) => ({
          ...testimonial,
          relationship: 'Testimonial', // Set the relationship property
        }));
        this.testimonials = [...this.testimonials, ...formattedTestimonials];
      }
    });
  }

  private loadGoogleReviews(): void {
    if (!this.business?.placeId) {
      console.error('Place ID is required to fetch Google reviews.');
      return;
    }

    this.googleMapsLoader.loadScript().then(() => {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails(
        { placeId: this.business?.placeId, fields: ['reviews'] },
        (place: any, status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const googleReviews = place?.reviews?.map((review: any) => ({
              name: review.author_name,
              quote: review.text,
              relationship: 'Google Review',
              isGoogle: true,
            })) || [];

            // Prepend Google reviews to the testimonials array
            this.testimonials = [...googleReviews, ...this.testimonials];
          } else {
            console.error('Error fetching Google reviews:', status);
          }
        }
      );
    });
  }

  get googleReviewLink(): string {
    return `https://search.google.com/local/writereview?placeid=${this.business?.placeId}`;
  }
}
