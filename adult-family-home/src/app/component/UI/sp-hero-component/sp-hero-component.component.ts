<<<<<<< HEAD
import { Component, HostListener, Inject, Input, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
=======


import { Component, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
import { Router } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
<<<<<<< HEAD
  selector: 'app-sp-hero-component',
  templateUrl: './sp-hero-component.component.html',
  styleUrls: ['./sp-hero-component.component.css'],
  standalone: false
})
export class SpHeroComponentComponent implements OnInit, OnDestroy {
=======
    selector: 'app-sp-hero-component',
    templateUrl: './sp-hero-component.component.html',
    styleUrls: ['./sp-hero-component.component.css'],
    standalone: false
})
export class SpHeroComponentComponent  implements OnInit, OnDestroy {
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  slides: any[] = [];
  currentSlide = 0;
  sliderOpacity = 1;
  autoSlideInterval: any;
  business: Business | null = null;
<<<<<<< HEAD
  isBrowser = false;
  private businessSub: any;
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

  @Input() navigation: 'side' | 'bottom' = 'side';
  @Input() sideButtons: boolean = true;
  @Input() sliderHeight: string = '100vh';
  @Input() buttonBorderRadius: string = '25px';
  @Input() subtitleSize: string = '1.5rem';
  @Input() subtitleWeight: string = '400';

<<<<<<< HEAD
  constructor(
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.fetchHeroSliderData();
    if (this.isBrowser) {
      this.startAutoSlide();
    }
  }

  fetchHeroSliderData(): void {
    this.businessSub = this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        this.business = data;
=======
  constructor(private businessDataService: BusinessDataService) {}

  ngOnInit(): void {
    this.fetchHeroSliderData();
    this.startAutoSlide();
  }

  fetchHeroSliderData(): void {
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        this.business = data;  // Store the business data
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
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
<<<<<<< HEAD
=======

>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  replaceKeywords(text: string): string {
    if (!text || !this.business?.businessName) {
      return text;
    }
    return text.replace(/{{businessName}}/g, this.business.businessName);
  }
<<<<<<< HEAD

=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  navigateToSlide(index: number): void {
    this.currentSlide = index;
  }

  startAutoSlide(): void {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 15000);
  }

  prevSlide(): void {
<<<<<<< HEAD
    if (!this.slides.length) return;
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    this.currentSlide = (this.currentSlide === 0) ? this.slides.length - 1 : this.currentSlide - 1;
  }

  nextSlide(): void {
<<<<<<< HEAD
    if (!this.slides.length) return;
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
<<<<<<< HEAD
    if (!this.isBrowser) return;
=======
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    this.sliderOpacity = Math.max(1 - scrollY / viewportHeight, 0);
  }

  ngOnDestroy(): void {
<<<<<<< HEAD
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    if (this.businessSub) {
      this.businessSub.unsubscribe();
    }
=======
    clearInterval(this.autoSlideInterval);
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }
}
