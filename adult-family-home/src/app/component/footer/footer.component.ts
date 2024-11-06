import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WebContentService } from '../../services/web-content.service';
import { Business } from '../../model/business-questions.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  business: Business | null = null;
  businessId: string | null = null;
  isAdmin = false;
  isAuthenticated$: Observable<boolean> | undefined;
  themeFileName?: string;

  constructor(
    private route: ActivatedRoute,
    private webContentService: WebContentService,
    private authService: AuthService,
    private themeService : ThemeService,
    private businessDataService: BusinessDataService
  ) {

  }


  ngOnInit(): void {
    // Subscribe to the business data from the BusinessDataService
    this.businessDataService.getBusinessData().subscribe(data => {
      this.business = data;
      console.log("Footer business: ", this.business);
    });

    // Subscribe to get the businessId from the BusinessDataService
    this.businessDataService.getBusinessId().subscribe(businessId => {
      if (businessId) {
        this.businessId = businessId;

        // Load the theme information based on the businessId
        this.themeService.getBusinessTheme(this.businessId).subscribe(tf => {
          if (tf) {
            this.themeFileName = tf.themeFileName;
          }
        });
      }
    });

    // Check if the user is authenticated
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
}
