import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WebContentService } from '../../services/web-content.service';
import { Business } from '../../model/business-questions.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme-service.service';

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
  themeFileName?: string;

  constructor(
    private route: ActivatedRoute,
    private webContentService: WebContentService,
    private authService: AuthService,
    private themeService : ThemeService
  ) {

  }


  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.businessId = params['id']


      this.webContentService.getBusinessData(this.businessId).subscribe(data => {
        if (data) {
          this.business = data;
          console.log("Footer business: ", this.business);
        }
      });

      this.themeService.getBusinessTheme(this.businessId).subscribe( tf =>{
        if(tf){
          this.themeFileName = tf.themeFileName;
        }
      });



    });

    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
}
