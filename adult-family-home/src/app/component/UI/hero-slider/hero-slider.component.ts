import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css']
})


export class HeroSliderComponent implements OnInit {
    business: Business | null = null; // Set to null initially

  constructor(private router: Router, private businessDataService: BusinessDataService) {
    this.autoSlide();
  }

  slides = [
    {
      title: 'we are ' + this.business?.businessName + '.',
      subtitle: 'professionals <br /> in the creative industries',
      backgroundImage: '../../../../assets/sharedAssets/istockphoto-1207318385-2048x2048.jpg',
      buttons: [
        { text: 'About Us', link: '/about-us', outline: false },
        { text: 'Schedule a Visit', link: '/contact-us', outline: true }
      ]
    },
    {
      title: 'Discover Our Home',
      subtitle: 'Explore the beauty of our space.',
      backgroundImage: '../../../../assets/sharedAssets/istockphoto-478915838-2048x2048.jpg',
      buttons: [
        { text: 'View Our Home', link: '/gallery', outline: false }
      ]
    },
    {
      title: 'Welcome New Residents',
      subtitle: 'We’re here to help you settle in.',
      backgroundImage: '../../../../assets/sharedAssets/istockphoto-1324090651-2048x2048.jpg',
      buttons: [
        { text: 'Resident Intake Form', link: '/resident-intake', outline: false }
      ]
    }
  ];


  ngOnInit(): void {
    console.log('hero-slider - ngOnInit');

    // Check if business data is already available
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        console.log('hero-slider - Using cached business data:', data);
        this.business = data; // Use cached data
      } else {

      }
    });
  }


  currentSlide = 0;


  navigateToSlide(index: number): void {
    this.currentSlide = index;
  }

  autoSlide(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000); // Change slide every 5 seconds
  }
}
