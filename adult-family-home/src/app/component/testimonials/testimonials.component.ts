import { Component, Input } from '@angular/core';
import { Testimonial } from 'src/app/model/business-questions.model';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css']
})
export class TestimonialsComponent {
  @Input() testimonials!: Testimonial[] | undefined;
}
