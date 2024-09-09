import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.component.html',
  styleUrls: ['./consultation.component.css']
})
export class ConsultationComponent {
  constructor(private router: Router) {}

  navigateToContact() {
    this.router.navigate(['/contact-us']);
  }
}
