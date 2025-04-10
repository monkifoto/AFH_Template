<<<<<<< HEAD
import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
=======
import { Component, Input, OnInit } from '@angular/core';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

declare var google: any;

@Component({
<<<<<<< HEAD
  selector: 'app-google-reviews',
  templateUrl: './google-reviews.component.html',
  styleUrls: ['./google-reviews.component.css'],
  standalone: false
})
export class GoogleReviewsComponent implements OnInit {
  @Input() placeId: string = '';
  reviews: any[] = [];
  currentReviewIndex: number = 0;
  intervalId: any;
  useMockReviews = environment.useMockGoogleReviews;
  isBrowser = false;

  constructor(
    private googleMapsLoader: GoogleMapsLoaderService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      console.warn('⛔ GoogleReviewsComponent skipped on server');
      return;
    }

=======
    selector: 'app-google-reviews',
    templateUrl: './google-reviews.component.html',
    styleUrls: ['./google-reviews.component.css'],
    standalone: false
})
export class GoogleReviewsComponent implements OnInit {
  @Input() placeId: string = ''; // Place ID passed to the component
  reviews: any[] = []; // Array to store reviews
  currentReviewIndex: number = 0; // Index of the currently displayed review
  intervalId: any; // ID of the interval for automatic rotation
  useMockReviews = environment.useMockGoogleReviews;

  constructor(private googleMapsLoader: GoogleMapsLoaderService,   private http: HttpClient) {}

  ngOnInit(): void {
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    if (this.useMockReviews) {
      this.loadMockReviews();
      this.startCarousel();
    } else {
      if (!this.placeId) {
        console.error('Place ID is required to fetch reviews.');
        return;
      }

      this.googleMapsLoader
        .loadScript()
        .then(() => {
          this.fetchReviews(this.placeId);
          this.startCarousel();
        })
        .catch((error) => {
          console.error('Error loading Google Maps script:', error);
        });
    }
  }
<<<<<<< HEAD

=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  private loadMockReviews(): void {
    this.http.get<any[]>('/assets/mocks/mock-reviews.json').subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: (err) => {
        console.error('Error loading mock reviews:', err);
      }
    });
  }

<<<<<<< HEAD
=======


>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  private fetchReviews(placeId: string): void {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(
      { placeId, fields: ['reviews'] },
      (place: any, status: string) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.reviews = place?.reviews || [];
        } else {
          console.error('Error fetching reviews:', status);
        }
      }
    );
  }

  private startCarousel(): void {
    this.intervalId = setInterval(() => {
      if (this.reviews.length > 0) {
        this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
      }
<<<<<<< HEAD
    }, 10000);
=======
    }, 10000); // Change review every 10 seconds
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  selectReview(index: number): void {
    this.currentReviewIndex = index;
<<<<<<< HEAD
    this.resetCarousel();
=======
    this.resetCarousel(); // Reset the rotation timer
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  private resetCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startCarousel();
    }
  }
}
