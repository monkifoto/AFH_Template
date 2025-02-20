import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Business, SliderConfig } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-hero-slider',
  templateUrl: './hero-slider.component.html',
  styleUrls: ['./hero-slider.component.css']
})
export class HeroSliderComponent implements OnInit {
  business: Business | null = null;
  slides: any[] = [];
  @Input() navigation: 'side' | 'bottom' = 'side';  // Default: side navigation
  @Input() sideButtons: boolean = true;  // Default: show side buttons
  @Input() sliderHeight: string = '100vh'; // Default height is 100vh
  @Input() buttonBorderRadius: string = '25px'; // Default border radius
  @Input() subtitleSize: string = '1.5rem'; // Default subtitle size
  @Input() subtitleWeight: string = '1.5rem'; // Default subtitle size

  currentSlide = 0;
  sliderOpacity = 1; // Initial opacity for the slider

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
        //console.log('HeroSliderComponent - Retrieved business data:', data);
        this.business = data;

        // Load slides
        if (this.business.heroSlider && Array.isArray(this.business.heroSlider)) {
          this.slides = this.business.heroSlider.map((slide: any) => ({
            title: this.replaceKeywords(slide.title),
            subtitle: this.replaceKeywords(slide.subtitle),
            backgroundImage: slide.backgroundImage,
            buttons: slide.buttons || []
          }));
          console.log("slide count:", this.slides.length);
        } else {
          console.warn('HeroSliderComponent - No heroSlider data available.');
          this.slides = [];
        }

        // Load slider configuration if available
        if (this.business.sliderConfig) {
          this.applySliderConfig(this.business.sliderConfig);
        } else {
          console.warn('HeroSliderComponent - No sliderConfig found, using default values.');
        }
      } else {
        console.error('HeroSliderComponent - No business data available.');
      }
    });
  }

  applySliderConfig(config: SliderConfig): void {
    this.navigation = config.navigation ?? 'side';
    this.sideButtons = config.sideButtons ?? true;
    this.sliderHeight = config.sliderHeight ?? '100vh';
    this.buttonBorderRadius = config.buttonBorderRadius ?? '25px';
    this.subtitleSize = config.subtitleSize ?? '1.5rem';
    this.subtitleWeight = config.subtitleWeight ?? '600';

    console.log('HeroSliderComponent - Applied slider config:', config);
  }
  replaceKeywords(text: string): string {
    if (!text || !this.business?.businessName) {
      return text;
    }
    return text.replace(/{{businessName}}/g, this.business.businessName);
  }

  navigateToSlide(index: number): void {
    this.currentSlide = index;
  }

  autoSlide(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 15000);
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide === 0) ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide === this.slides.length - 1) ? 0 : this.currentSlide + 1;
  }

  // Scroll event listener to adjust opacity
  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollY = window.scrollY; // Get the current scroll position
    const viewportHeight = window.innerHeight; // Get the viewport height

    // Calculate the new opacity based on scroll position
    this.sliderOpacity = Math.max(1 - scrollY / viewportHeight, 0);
  }
}
