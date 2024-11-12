import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements  OnInit {
  backgroundImage: string = '';
  message: string = '';

  private imagesAndMessages: { [key in 'services' | 'gallery' | 'about-us' | 'contact-us']: { image: string; message: string } } = {
    'services': { image: '../../../../assets/sharedAssets/istockphoto-1207318385-2048x2048.jpg', message: 'Discover our Services' },
    'gallery': { image: '../../../../assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg', message: 'Explore our Gallery' },
    'about-us': { image: '../../../../assets/sharedAssets/istockphoto-804432288-2048x2048.jpg', message: 'Learn About Us' },
    'contact-us': { image: '../../../../assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg', message: 'Get in Touch' },
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const page = params.get('page') as 'services' | 'gallery' | 'about-us' | 'contact-us'; // Get 'page' from the route parameter

      if (page && this.imagesAndMessages[page]) {
        this.backgroundImage = `url(${this.imagesAndMessages[page].image})`;
        this.message = this.imagesAndMessages[page].message;
      } else {
        // Fallback in case the page is not found in imagesAndMessages
        this.backgroundImage = 'url(../../../../assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg)';
        this.message = 'Welcome';
      }
    });
  }
}
