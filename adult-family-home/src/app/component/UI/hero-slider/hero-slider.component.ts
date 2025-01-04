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
    slides: any[] = [];
    currentSlide = 0;

  constructor(private router: Router, private businessDataService: BusinessDataService) {
    this.autoSlide();
  }


  ngOnInit(): void {
    console.log('HeroSliderComponent - ngOnInit');
    this.fetchHeroSliderData();
    this.autoSlide();
  }

  fetchHeroSliderData(): void {
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        console.log('HeroSliderComponent - Retrieved business data:', data);
        this.business = data;

        if (this.business.heroSlider && Array.isArray(this.business.heroSlider)) {
          this.slides = this.business.heroSlider.map((slide: any) => ({
            title: this.replaceKeywords(slide.title),
            subtitle: this.replaceKeywords(slide.subtitle),
            backgroundImage: slide.backgroundImage,
            buttons: slide.buttons || []
          }));
        } else {
          console.warn('HeroSliderComponent - No heroSlider data available in the business data.');
          this.slides = [];
        }
      } else {
        console.error('HeroSliderComponent - No business data available.');
      }
    });
  }

  replaceKeywords(text: string): string {
    if (!text || !this.business?.businessName) {
      return text; // Return the original text if there's no business name or text
    }

    // Replace the special keyword "{{businessName}}" with the business name
    return text.replace(/{{businessName}}/g, this.business.businessName);
  }

  navigateToSlide(index: number): void {
    this.currentSlide = index;
  }

  autoSlide(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 15000); // Change slide every 5 seconds
  }
}
