import { Business } from 'src/app/model/business-questions.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



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
    standalone: false
})
export class TestimonialCarouselComponent implements OnInit, OnDestroy {
  @Input() businessId!: string;
  @Input() placeId!: string; // For Google reviews
  business: Business | null = null;
  useMockReviews = environment.useMockGoogleReviews;
  business$ = this.businessDataService.businessData$;
  testimonials: any[] = [];
  currentIndex = 0;
  private autoPlayInterval: any;
  private maxTextLength = 300; // Maximum characters before truncation

  constructor(
    private businessDataService: BusinessDataService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit() {
    console.log("Testimonial Carousel Loading for ID: ",  this.businessId);

    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        this.business = data;
    }
  });


  if (this.useMockReviews) {
    this.loadMockGoogleReviews();
  } else if (this.business?.placeId !== '0') {
    this.loadGoogleReviews();
  }
    this.loadTestimonials();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  private loadMockGoogleReviews() {
    this.http.get<any[]>('/assets/mocks/mock-reviews.json').subscribe({
      next: (mockData) => {
        const googleReviews = mockData.map((review: any) => ({
          name: review.author_name,
          quote: review.text,
          relationship: 'Mock Google Review',
          isGoogle: true,
        }));

        this.testimonials = [...googleReviews, ...this.testimonials];
        this.currentIndex = 0;
      },
      error: (err) => console.error('Failed to load mock reviews', err)
    });
  }

  private loadTestimonials() {
    this.businessDataService.loadBusinessData(this.businessId).subscribe((business) => {
      if (business && business.testimonials) {
        const formattedTestimonials = business.testimonials.map((testimonial: any) => ({
          ...testimonial,
          relationship: 'Testimonial',
          isGoogle: false,
          rawQuote: testimonial.quote,
          quote: this.sanitizeHtml(testimonial.quote),
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
    return this.testimonials.length > 0 ? this.testimonials[this.currentIndex] : null;
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

  previousSlide() {
    if (this.testimonials.length > 0) {
      this.currentIndex =
        (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    }
  }
  nextSlide() {
    if (this.testimonials.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }
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


  navigateTo(page:string) {
    this.businessDataService.getBusinessId().subscribe((businessId) => {
       if (businessId) {
         this.businessId = businessId;
       }
     });
     console.log('Page: '+ page + ' Parameters = '+ this.businessId);
     this.router.navigate(['/'+page], { queryParams: { id: this.businessId } });
   }

   sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  get googleReviewLink(): string {
    return `https://search.google.com/local/writereview?placeid=${this.placeId}`;
  }

}
