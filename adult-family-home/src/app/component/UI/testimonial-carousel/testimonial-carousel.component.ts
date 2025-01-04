import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-testimonial-carousel',
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.css'],
  animations: [
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateX(-100%)', opacity: 0 })),
      ]),
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ transform: 'translateX(100%)', opacity: 0 })),
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
}
