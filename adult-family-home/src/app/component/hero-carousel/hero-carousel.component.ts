import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Business } from 'src/app/model/business-questions.model';
import { WebContentService } from 'src/app/services/web-content.service';

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.css']
})
export class HeroCarouselComponent implements OnInit {
  businessId!: string;
  business!: Business | undefined;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private webContentService: WebContentService) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'];
      this.webContentService.getBusinessData(this.businessId).subscribe(data => {
        if (data) {
          this.business = data;
        }
      });
    });
  }

navigateToContact() {
  this.router.navigate(['/contact-us']);
}

}
