import { Business } from 'src/app/model/business-questions.model';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  @Input() layoutType: string = 'demo';
  @Input() business!: Business;

  constructor(private router: Router) {}

  navigateToContact() {
    this.router.navigate(['/contact-us'], {
      queryParams: { id: this.business['businessId'] },
    });
  }
}
