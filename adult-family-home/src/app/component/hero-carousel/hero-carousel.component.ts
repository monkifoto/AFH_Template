import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit {
  @Input() businessID: string | undefined;
  business: any;


  constructor(private router: Router) {}

  ngOnInit() {
    this.fetchBusinessData();
  }


navigateToContact() {
  this.router.navigate(['/contact-us']);
}
  fetchBusinessData() {
    // Fetch the business data based on businessID
    // This is a placeholder for actual data fetching logic.
    // Replace it with a service that fetches data from your backend or Firebase.
    this.business = {
      businessName: '#1 Helping Hand AFH',
      tagline: 'We’re Family, Not Just Care.',
      heroImages: [
        '../../../assets/sharedAssets/istockphoto-804432288-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-613308420-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-918529390-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-1324090651-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-653191338-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-1170514008-2048x2048.jpg',
        '../../../assets/sharedAssets/istockphoto-1315315044-2048x2048.jpg'
      ]
    };
  }
}
