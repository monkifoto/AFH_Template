import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';

declare var google: any;

@Component({
  selector: 'app-testimonial-carousel',
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0, transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class TestimonialCarouselComponent implements OnInit, OnDestroy {
  @Input() businessId!: string;
  @Input() placeId!: string; // For Google reviews
  testimonials: any[] = [];
  currentIndex = 0;
  private autoPlayInterval: any;
  private maxTextLength = 300; // Maximum characters before truncation

  constructor(
    private businessDataService: BusinessDataService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGoogleReviews();
    this.loadTestimonials();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  private loadTestimonials() {
    this.businessDataService.loadBusinessData(this.businessId).subscribe((business) => {
      if (business && business.testimonials) {
        const formattedTestimonials = business.testimonials.map((testimonial: any) => ({
          ...testimonial,
          relationship: 'Testimonial', // Set the relationship property
        }));
        this.testimonials = [...this.testimonials, ...formattedTestimonials];
      }
    });
  }

  private loadGoogleReviews() {
    if (!this.placeId) {
      console.error('Place ID is required to fetch Google reviews.');
      return;
    }

    this.googleMapsLoader.loadScript().then(() => {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails(
        { placeId: this.placeId, fields: ['reviews'] },
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

            // Start the carousel with the first Google review
            this.currentIndex = 0;
          } else {
            console.error('Error fetching Google reviews:', status);
          }
        }
      );
    });
  }


  get currentTestimonial() {
    return this.testimonials[this.currentIndex];
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 15000); // Change slide every 15 seconds
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  trackByIndex(index: number, _: any): number {
    return index;
  }

  truncateText(text: string): string {
    return text.length > this.maxTextLength
      ? text.slice(0, this.maxTextLength)
      : text;
  }

  isTruncated(text: string): boolean {
    return text.length > this.maxTextLength;
  }

  navigateToTestimonials() {
    this.router.navigate(['/testimonials']); // Update with your testimonials page route
  }
}
