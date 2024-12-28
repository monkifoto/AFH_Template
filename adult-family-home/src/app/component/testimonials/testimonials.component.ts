import { Component, Input } from '@angular/core';
import { Testimonial } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  @Input() testimonials!: Testimonial[] | undefined;
  @Input() layoutType: string = 'demo';

  currentIndex: number = 0;

  setSlide(index: number): void {
    this.currentIndex = index;
  }

  // currentIndex: number = 0;

  // prevSlide(): void {
  //   if (this.testimonials) {
  //     this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
  //   }
  // }

  // nextSlide(): void {
  //   if (this.testimonials) {
  //     this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
  //   }
  // }
}
