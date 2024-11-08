import { Business } from './../../model/business-questions.model';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent {
  @Input() welcomeMsg!: string;
  @Input() keyServicesHighlights!: string;
  @Input() businessName!: string;
  @Input() businessId!: string;
  @Input() layoutType: string = 'demo';

  constructor(private router: Router) {}

  navigateToContact() {
    this.router.navigate(['/contact-us'], {
      queryParams: { id: this.businessId },
    });
  }
}
