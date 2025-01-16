import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-testimonial-carousel',
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0, transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],

})
export class TestimonialCarouselComponent implements OnInit, OnDestroy {
  @Input() businessId!: string;
  testimonials: any[] = [];
  currentIndex = 0;
  private autoPlayInterval: any;

  constructor(private businessDataService: BusinessDataService) {}

  ngOnInit() {
    this.loadTestimonials();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  loadTestimonials() {
    this.businessDataService.loadBusinessData(this.businessId).subscribe((business) => {
      if (business && business.testimonials) {
        this.testimonials = business.testimonials;
      }
    });
  }

  get currentTestimonial() {
    return this.testimonials[this.currentIndex];
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 15000); // Change slide every 15 seconds
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  }

  trackByIndex(index: number, _: any): number {
    return index;
  }
}
