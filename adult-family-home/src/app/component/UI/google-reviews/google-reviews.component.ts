import { Component, Input, OnInit } from '@angular/core';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';

declare var google: any;

@Component({
  selector: 'app-google-reviews',
  templateUrl: './google-reviews.component.html',
  styleUrls: ['./google-reviews.component.css'],
})
export class GoogleReviewsComponent implements OnInit {
  @Input() placeId: string = ''; // Place ID passed to the component
  reviews: any[] = []; // Array to store reviews
  currentReviewIndex: number = 0; // Index of the currently displayed review
  intervalId: any; // ID of the interval for automatic rotation

  constructor(private googleMapsLoader: GoogleMapsLoaderService) {}

  ngOnInit(): void {
    if (!this.placeId) {
      console.error('Place ID is required to fetch reviews.');
      return;
    }

    this.googleMapsLoader
      .loadScript()
      .then(() => {
        this.fetchReviews(this.placeId);
        this.startCarousel(); // Start the carousel swapping
      })
      .catch((error) => {
        console.error('Error loading Google Maps script:', error);
      });
  }

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
    }, 10000); // Change review every 10 seconds
  }

  selectReview(index: number): void {
    this.currentReviewIndex = index;
    this.resetCarousel(); // Reset the rotation timer
  }

  private resetCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startCarousel();
    }
  }
}
