import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements  OnInit {
  @Input() layoutType: string = 'demo';
  backgroundImage: string = '';
  message: string = '';

  private imagesAndMessages: { [key in 'services' | 'gallery' | 'about-us' | 'contact-us' | 'testimonials' | 'resident-form']: { image: string; message: string } } = {
    'services': { image: '../../../../assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg', message: 'Discover our Services' },
    'gallery': { image: '../../../../assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg', message: 'Explore our Gallery' },
    'about-us': { image: '../../../../assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg', message: 'Learn About Us' },
    'contact-us': { image: '../../../../assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg', message: 'Get in Touch' },
    'testimonials': { image: '../../../../assets/sharedAssets/istockphoto-653191338-2048x2048.jpg', message: 'What they say about us' },
    'resident-form': { image: '../../../../assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg', message: 'Let us make you feel at home'}
  };

  private imagesAndMessagesSB: { [key in 'services' | 'gallery' | 'about-us' | 'contact-us' | 'testimonials' | 'resident-form']: { image: string; message: string } } = {
    'services': { image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FlifeStyle%2Fistockphoto-1455953950-1024x1024.jpg?alt=media&token=f8875a81-4502-4e3f-b9f3-de7efa57d34f', message: 'Discover our Services' },
    'gallery': { image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FlifeStyle%2Fistockphoto-1735411371-1024x1024.jpg?alt=media&amp;token=03a733b3-0eff-4cda-b06c-108a886f5921', message: 'Explore our Gallery' },
    'about-us': { image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FlifeStyle%2Fistockphoto-1336136316-1024x1024.jpg?alt=media&token=2e625f22-8511-447b-bfb1-18919c2c276b', message: 'Learn About Us' },
    'contact-us': { image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FlifeStyle%2Fistockphoto-1367776831-1024x1024.jpg?alt=media&token=1272b1b2-ad7f-425a-b17e-10ba49234dab', message: 'Get in Touch' },
    'testimonials': { image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FlifeStyle%2Fistockphoto-1456339578-1024x1024.jpg?alt=media&token=2e380b78-c7ba-46c4-bd9b-fd8d3cc6e818', message: 'What they say about us' },
    'resident-form': { image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FlifeStyle%2Fistockphoto-1336136316-1024x1024.jpg?alt=media&token=2e625f22-8511-447b-bfb1-18919c2c276b', message: 'Les us make you feel at home'
    }
  };
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url.split('?')[0]; // Get the path without query params
      const page = currentUrl.replace('/', '') as 'services' | 'gallery' | 'about-us' | 'contact-us' | 'testimonials' | 'resident-form';
      console.log('UI - Hero, page: ', page);

      // Select image set based on layoutType
      const selectedImages = this.layoutType === 'sb' ? this.imagesAndMessagesSB : this.imagesAndMessages;

      if (page && selectedImages[page]) {
        this.backgroundImage = `url(${selectedImages[page].image})`;
        this.message = selectedImages[page].message;
      } else {
        // Fallback in case the page is not found
        this.backgroundImage = 'url(../../../../assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg)';
        this.message = 'Welcome';
      }
    });
  }
}
