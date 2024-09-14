import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WebContentService } from '../../services/web-content.service';
import { Business } from '../../model/business-questions.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  businessId!: string;
  business!: Business | undefined;

  constructor(
    private route: ActivatedRoute,
    private webContentService: WebContentService
  ) {}


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
}
