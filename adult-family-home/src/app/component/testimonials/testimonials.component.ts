import { Component, Input } from '@angular/core';
import { Testimonial } from 'src/app/model/business-questions.model';

@Component({
    selector: 'app-testimonials',
    templateUrl: './testimonials.component.html',
    styleUrls: ['./testimonials.component.css'],
    standalone: false
})
export class TestimonialsComponent {
  @Input() testimonials!: Testimonial[] | undefined;
  @Input() layoutType: string = 'demo';

  currentIndex: number = 0;

  autoAdvanceInterval: any;

  ngOnInit() {
<<<<<<< HEAD
    if (Array.isArray(this.testimonials) && this.testimonials.length > 0) {
      this.startAutoAdvance();
    }
=======
    this.startAutoAdvance();
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  ngOnDestroy() {
    this.stopAutoAdvance();
  }

  setSlide(index: number) {
    this.currentIndex = index;
    this.restartAutoAdvance(); // Restart timer when manually changing slides
  }

  startAutoAdvance() {
<<<<<<< HEAD
    if (Array.isArray(this.testimonials) && this.testimonials.length > 1) {
      this.autoAdvanceInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials!.length;
      }, 5000);
    }
=======
    this.autoAdvanceInterval = setInterval(() => {
      if (Array.isArray(this.testimonials)) {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
      }
    }, 5000); // 5 seconds
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }

  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
    }
  }

  restartAutoAdvance() {
    this.stopAutoAdvance();
    this.startAutoAdvance();
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
