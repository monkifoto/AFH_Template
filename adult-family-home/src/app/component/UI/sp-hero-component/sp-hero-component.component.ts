

import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
    selector: 'app-sp-hero-component',
    templateUrl: './sp-hero-component.component.html',
    styleUrls: ['./sp-hero-component.component.css'],
    standalone: false
})
export class SpHeroComponentComponent  implements OnInit, OnDestroy {
  slides: any[] = [];
  currentSlide = 0;
  sliderOpacity = 1;
  autoSlideInterval: any;
  business: Business | null = null;

  @Input() navigation: 'side' | 'bottom' = 'side';
  @Input() sideButtons: boolean = true;
  @Input() sliderHeight: string = '100vh';
  @Input() buttonBorderRadius: string = '25px';
  @Input() subtitleSize: string = '1.5rem';
  @Input() subtitleWeight: string = '400';

  constructor(private businessDataService: BusinessDataService) {}

  ngOnInit(): void {
    this.fetchHeroSliderData();
    this.startAutoSlide();
  }

  fetchHeroSliderData(): void {
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        this.business = data;  // Store the business data
        this.slides = data.heroSlider?.map(slide => ({
          ...slide,
          title: this.replaceKeywords(slide.title),
          subtitle: this.replaceKeywords(slide.subtitle)
        })) || [];
      } else {
        console.warn('No heroSlider data available.');
      }
    });
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

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 15000);
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide === 0) ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    this.sliderOpacity = Math.max(1 - scrollY / viewportHeight, 0);
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSlideInterval);
  }
}
