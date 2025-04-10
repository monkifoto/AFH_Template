<<<<<<< HEAD
import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, style, animate, transition } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { Business } from 'src/app/model/business-questions.model';
import { environment } from 'src/environments/environment';
import { first } from 'rxjs/operators';
=======
import { Business } from 'src/app/model/business-questions.model';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

declare var google: any;

@Component({
<<<<<<< HEAD
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
  @Input() placeId!: string;

  business: Business | null = null;
  useMockReviews = environment.useMockGoogleReviews;
  testimonials: any[] = [];
  currentIndex = 0;
  private autoPlayInterval: any;
  private maxTextLength = 300;
=======
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
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

  constructor(
    private businessDataService: BusinessDataService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private router: Router,
    private sanitizer: DomSanitizer,
<<<<<<< HEAD
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {

    console.log('✅ TestimonialCarousel Init with ID:', this.businessId);

    if (isPlatformServer(this.platformId)) {
      console.warn('⛔ Skipping TestimonialCarousel on server');
      return; // ✅ Prevent SSR from loading anything
    }

    if (this.businessId) {
      this.initWithBusinessId(this.businessId);
    } else {
      this.businessDataService.getBusinessId().pipe(first()).subscribe((id) => {
        if (id) {
          this.businessId = id;
          this.initWithBusinessId(id);
        } else {
          console.warn('❌ TestimonialCarousel: No businessId provided or resolved.');
        }
      });
    }
  }

  private initWithBusinessId(businessId: string) {
    console.log("✅ TestimonialCarousel Init with ID:", businessId);

    this.businessDataService.loadBusinessData(businessId).pipe(first()).subscribe((business) => {
      if (!business) {
        console.warn('❌ TestimonialCarousel: No business data returned');
        return;
      }

      this.business = business;

      if (this.useMockReviews && !isPlatformServer(this.platformId)) {
        this.loadMockGoogleReviews();
      } else if (this.business.placeId !== '0') {
        this.loadGoogleReviews();
      }

      this.loadTestimonials();
      this.startAutoPlay();
    });
=======
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
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  private loadMockGoogleReviews() {
    this.http.get<any[]>('/assets/mocks/mock-reviews.json').subscribe({
      next: (mockData) => {
<<<<<<< HEAD
        const googleReviews = mockData.map((review) => ({
=======
        const googleReviews = mockData.map((review: any) => ({
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
          name: review.author_name,
          quote: review.text,
          relationship: 'Mock Google Review',
          isGoogle: true,
        }));
<<<<<<< HEAD
        this.testimonials = [...googleReviews, ...this.testimonials];
        this.currentIndex = 0;
      },
      error: (err) => console.error('❌ Failed to load mock reviews:', err),
=======

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
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    });
  }

  private loadGoogleReviews() {
<<<<<<< HEAD
    if (isPlatformServer(this.platformId)) {
      console.warn('⚠️ Skipping Google Maps on server.');
      return;
    }

    if (!this.placeId) {
      console.error('❌ Missing placeId for Google Reviews.');
=======
    if (!this.placeId) {
      console.error('Place ID is required to fetch Google reviews.');
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      return;
    }

    this.googleMapsLoader.loadScript().then(() => {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails(
        { placeId: this.placeId, fields: ['reviews'] },
        (place: any, status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
<<<<<<< HEAD
            const googleReviews = place.reviews?.map((review: any) => ({
=======
            const googleReviews = place?.reviews?.map((review: any) => ({
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
              name: review.author_name,
              quote: review.text,
              relationship: 'Google Review',
              isGoogle: true,
            })) || [];
<<<<<<< HEAD
            this.testimonials = [...googleReviews, ...this.testimonials];
            this.currentIndex = 0;
          } else {
            console.error('❌ Google Reviews failed with status:', status);
=======

            // Prepend Google reviews to the testimonials array
            this.testimonials = [...googleReviews, ...this.testimonials];

            // Start the carousel with the first Google review
            this.currentIndex = 0;
          } else {
            console.error('Error fetching Google reviews:', status);
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
          }
        }
      );
    });
  }

<<<<<<< HEAD
  private loadTestimonials() {
    this.businessDataService.loadBusinessData(this.businessId).pipe(first()).subscribe((business) => {
      if (business?.testimonials?.length) {
        const formatted = business.testimonials.map((testimonial) => ({
          ...testimonial,
          relationship: 'Testimonial',
          isGoogle: false,
          rawQuote: testimonial.quote,
          quote: this.sanitizeHtml(testimonial.quote),
        }));
        this.testimonials = [...this.testimonials, ...formatted];
      }
    });
  }

=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  get currentTestimonial() {
    return this.testimonials.length > 0 ? this.testimonials[this.currentIndex] : null;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoPlay() {
<<<<<<< HEAD
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 15000);
=======
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 15000); // Change slide every 15 seconds
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
<<<<<<< HEAD
=======
      this.autoPlayInterval = null;
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    }
  }

  previousSlide() {
    if (this.testimonials.length > 0) {
<<<<<<< HEAD
      this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    }
  }

=======
      this.currentIndex =
        (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    }
  }
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  nextSlide() {
    if (this.testimonials.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }
  }

<<<<<<< HEAD
  trackByIndex(index: number): number {
    return index;
  }

  truncateText(text: string | undefined): string {
    return text && text.length > this.maxTextLength ? text.slice(0, this.maxTextLength) : text || '';
  }

  isTruncated(text: string | undefined): boolean {
    return !!text && text.length > this.maxTextLength;
  }

  navigateTo(page: string) {
    this.router.navigate(['/' + page], {
      queryParams: { id: this.businessId },
    });
  }

  sanitizeHtml(html: string): SafeHtml {
=======
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
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  get googleReviewLink(): string {
    return `https://search.google.com/local/writereview?placeid=${this.placeId}`;
  }
<<<<<<< HEAD
=======

>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
}
