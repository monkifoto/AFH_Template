import { Component, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme-service.service';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-color-admin',
  templateUrl: './color-admin.component.html',
  styleUrls: ['./color-admin.component.css']
})

export class ColorAdminComponent implements OnInit {
  themeColors$: Observable<any> | undefined;
  businessId!: string;

  constructor(private themeService: ThemeService,
     private businessService: BusinessService,
     private route: ActivatedRoute,
     private router: Router) {}

  ngOnInit(): void {
    // Fetch the theme colors for the business


    this.route.paramMap.subscribe(params => {
      this.businessId = params.get('id')!;
     // console.log('Business ID:', this.businessId); // Debugging line
      if (this.businessId) {
        this.themeColors$ = this.themeService.getThemeColors(this.businessId);
        this.themeService.getThemeColors(this.businessId).subscribe(theme => {
          console.log('Fetched theme:', theme);
        });
      }
      else{
        //load defaults
      }
    });

    this.themeColors$ = this.themeService.getThemeColors(this.businessId);
  }

  onSubmit() {
    // Save the updated colors to Firestore
    this.themeColors$?.subscribe(themeColors => {
      this.themeService.updateColors(this.businessId, themeColors).then(() => {
        console.log('Colors updated successfully');
      }).catch(error => {
        console.error('Error updating colors:', error);
      });
    });
  }

  resetToDefault() {
    // Reset to default colors
    this.themeService.resetToDefaultColors().subscribe(defaultColors => {
      this.themeColors$ = new Observable(observer => {
        observer.next(defaultColors);
      });
    });
  }
}
