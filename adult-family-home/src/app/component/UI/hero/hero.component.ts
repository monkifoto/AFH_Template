import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements  OnInit {
  backgroundImage: string = '';
  message: string = '';

  private imagesAndMessages: { [key in 'services' | 'gallery' | 'about-us' | 'contact-us' | 'testimonials']: { image: string; message: string } } = {
    'services': { image: '../../../../assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg', message: 'Discover our Services' },
    'gallery': { image: '../../../../assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg', message: 'Explore our Gallery' },
    'about-us': { image: '../../../../assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg', message: 'Learn About Us' },
    'contact-us': { image: '../../../../assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg', message: 'Get in Touch' },
    'testimonials': { image: '../../../../assets/sharedAssets/istockphoto-653191338-2048x2048.jpg', message: 'What they say about us' },
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url.split('?')[0]; // Get the path without query params
      const page = currentUrl.replace('/', '') as 'services' | 'gallery' | 'about-us' | 'contact-us';
      console.log('UI - Hero, page: ', page);


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
