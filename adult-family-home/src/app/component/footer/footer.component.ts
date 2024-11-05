import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WebContentService } from '../../services/web-content.service';
import { Business } from '../../model/business-questions.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  businessId!: string;
  business!: Business | undefined;
  isAdmin = false;
  isAuthenticated$: Observable<boolean> | undefined;

  constructor(
    private route: ActivatedRoute,
    private webContentService: WebContentService,
    private authService: AuthService
  ) {

  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id'];
      console.log("Footer businessId: ", this.businessId);
      this.webContentService.getBusinessData(this.businessId).subscribe(data => {
        if (data) {
          this.business = data;
        }
      });
    });

    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
}
