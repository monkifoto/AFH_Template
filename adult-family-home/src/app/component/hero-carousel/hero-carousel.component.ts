import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit {
  @Input() businessID: string | undefined;
  business: any;

  ngOnInit() {
    this.fetchBusinessData();
  }

  fetchBusinessData() {
    // Fetch the business data based on businessID
    // This is a placeholder for actual data fetching logic.
    // Replace it with a service that fetches data from your backend or Firebase.
    this.business = {
      businessName: '#1 Helping Hand AFH',
      tagline: 'We’re Family, Not Just Care.',
      heroImages: [
        '../../../assets/sharedAssets/istockphoto-613308420-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-804432288-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-1315315044-2048x2048.jpg'
      ]
    };
  }
}