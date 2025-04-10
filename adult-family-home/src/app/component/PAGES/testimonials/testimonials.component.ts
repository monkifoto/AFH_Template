import { Component, OnInit } from '@angular/core';
import { Business } from 'src/app/model/business-questions.model';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, Observable, of, switchMap } from 'rxjs';
<<<<<<< HEAD
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

declare var google: any;
@Component({
    selector: 'app-testimonials-list',
    templateUrl: './testimonials.component.html',
    styleUrls: ['./testimonials.component.css'],
    standalone: false
})
export class TestimonialsListComponent implements OnInit {
  testimonials: any[] = [];
  themeType: string | null = null;
  business: Business | null = null;
  googleReviewsLoading = true;
  constructor(
    private businessDataService: BusinessDataService,
    private metaService: MetaService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private sanitizer: DomSanitizer,
<<<<<<< HEAD
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
=======
    private route: ActivatedRoute
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  ) {}

  ngOnInit(): void {
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        this.business = data;
        this.loadData();
      } else {
        // If no data from service, try getting business ID from query params
        this.route.queryParams.subscribe((params) => {
          const businessId = params['id'];
          if (businessId) {
            this.businessDataService.loadBusinessData(businessId).subscribe((business) => {
              if (business) {
                this.business = business;
                this.loadData();
              }
            });
          }
        });
      }
    });
  }

<<<<<<< HEAD

  private loadData(): void {
    this.loadTestimonials();
    if (isPlatformBrowser(this.platformId) && this.business?.placeId !== '0') {
=======
  // ngOnInit(): void {
  //   this.businessDataService.businessData$
  //     .pipe(
  //       switchMap((data: Business | null): Observable<Business | null> => {
  //         if (data) {
  //           return of(data);
  //         }

  //         return this.route.queryParams.pipe(
  //           switchMap((params: Params): Observable<Business | null> => {
  //             const businessId = params['id'];
  //             if (businessId) {
  //               return this.businessDataService.loadBusinessData(businessId);
  //             } else {
  //               return of(null);
  //             }
  //           })
  //         );
  //       }),
  //       filter((business: Business | null): business is Business => !!business)
  //     )
  //     .subscribe((business: Business) => {
  //       this.business = business;
  //       this.loadData();
  //     });
  // }

  private loadData(): void {
    this.loadTestimonials();
    if (this.business?.placeId !== '0') {
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
      this.loadGoogleReviews();
    }
  }

<<<<<<< HEAD
  // private loadTestimonials(): void {
  //   this.businessDataService
  //     .loadBusinessData(this.business?.id || '')
  //     .subscribe((business) => {
  //       if (business && business.testimonials) {
  //         const formattedTestimonials = business.testimonials.map(
  //           (testimonial: any) => ({
  //             ...testimonial,
  //             relationship: 'Testimonial', // Set the relationship property
  //             rawQuote: testimonial.quote,
  //             quote: this.sanitizeHtml(testimonial.quote),
  //             isGoogle: false,
  //           })
  //         );
  //         this.testimonials = [...this.testimonials, ...formattedTestimonials];
  //       }
  //     });
  // }

  private loadTestimonials(): void {
    if (this.business?.testimonials) {
      const formattedTestimonials = this.business.testimonials.map((testimonial: any) => ({
        ...testimonial,
        relationship: 'Testimonial',
        rawQuote: testimonial.quote,
        quote: this.sanitizeHtml(testimonial.quote),
        isGoogle: false,
      }));
      this.testimonials = [...this.testimonials, ...formattedTestimonials];
    }
  }


=======
  private loadTestimonials(): void {
    this.businessDataService
      .loadBusinessData(this.business?.id || '')
      .subscribe((business) => {
        if (business && business.testimonials) {
          const formattedTestimonials = business.testimonials.map(
            (testimonial: any) => ({
              ...testimonial,
              relationship: 'Testimonial', // Set the relationship property
              rawQuote: testimonial.quote,
              quote: this.sanitizeHtml(testimonial.quote),
              isGoogle: false,
            })
          );
          this.testimonials = [...this.testimonials, ...formattedTestimonials];
        }
      });
  }

>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  private loadGoogleReviews(): void {
    if (!this.business?.placeId) {
      console.error('Place ID is required to fetch Google reviews.');
      return;
    }

    this.googleMapsLoader.loadScript().then(() => {
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );
      service.getDetails(
        { placeId: this.business?.placeId, fields: ['reviews'] },
        (place: any, status: string) => {
          this.googleReviewsLoading = false;
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const googleReviews =
              place?.reviews?.map((review: any) => ({
                name: review.author_name,
                quote: review.text,
                rawQuote: review.text,
                relationship: 'Google Review',
                isGoogle: true,
                photoURL: review.profile_photo_url || null,
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

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
function take(arg0: number): import("rxjs").OperatorFunction<Business | null, unknown> {
  throw new Error('Function not implemented.');
}

