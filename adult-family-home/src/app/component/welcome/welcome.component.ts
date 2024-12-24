import { Business } from 'src/app/model/business-questions.model';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  @Input() layoutType: string = 'demo';
  @Input() businessId:  string = '';
  business: Business | null = null; // Set to null initially

  constructor(private router: Router, private businessDataService: BusinessDataService) {}

  ngOnInit(): void {
    console.log('HomeComponent - ngOnInit');

    // Check if business data is already available
    this.businessDataService.businessData$.subscribe((data) => {
      if (data) {
        console.log('HomeComponent - Using cached business data:', data);
        this.business = data; // Use cached data
      } else {

      }
    });
  }

  navigateToContact() {
    this.router.navigate(['/contact-us'], {
      queryParams: { id: this.businessId },
    });
  }
}
