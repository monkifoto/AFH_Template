import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from './services/meta-service.service';
import { WebContentService } from './services/web-content.service';
import { Business } from './model/business-questions.model';
import { ThemeService } from './services/theme-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'adult-family-home';
  businessId!: string;
  business!: Business;

  constructor(
    private route: ActivatedRoute,
    private webContent: WebContentService,
    private metaService: MetaService,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Fetch business ID from the URL query params
    this.route.queryParams.subscribe((params) => {
      this.businessId = params['id'];
      // Load the business data and theme after fetching the business ID
      this.loadBusinessData();
      //this.loadThemeColors();
    });
  }

  // Fetch business data
  loadBusinessData() {
    this.webContent.getBusinessData(this.businessId).subscribe((data) => {
      if (data) {
        this.business = data;
      }
    });
  }

  // Fetch theme colors and apply them
  // loadThemeColors() {
  //   this.themeService.getThemeColors(this.businessId).subscribe((themeColors) => {
  //     console.log("app.component:  Theme colors: ", themeColors);
  //     if (themeColors && this.hasValidColors(themeColors)) {
  //       this.colors = themeColors;

  //       this.applyTheme();
  //     } else {
  //       console.warn('No valid colors found in the database. Applying default theme.');
  //       // Fallback to default theme if no valid colors found
  //       this.themeService.resetToDefaultColors().subscribe((defaultColors) => {
  //         if (defaultColors && this.hasValidColors(defaultColors)) {
  //           this.colors = defaultColors;
  //         } else {
  //           // Use hardcoded defaults if all fails
  //           this.colors = {
  //             primaryColor: '#fffaf2',
  //             secondaryColor: '#f8f3f0',
  //             accentColor: '#F0C987',
  //             backgroundColor: '#F5F3E7',
  //             darkBackgroundColor: '#4C6A56',
  //             textColor: '#2F2F2F',
  //             navBackgroundColor: '#F5F3E7',
  //             navTextColor: '#33372C',
  //             navActiveBackground: '#33372C',
  //             navActiveText: '#ffffff',
  //             buttonColor: '#D9A064',
  //             buttonHoverColor: '#c9605b'
  //           };
  //         }
  //         this.applyTheme();
  //       });
  //     }
  //   }, (error) => {
  //     console.error('Error fetching theme colors: ', error);
  //     // Apply default theme on error
  //     this.colors = {
  //       primaryColor: '#fffaf2',
  //       secondaryColor: '#f8f3f0',
  //       accentColor: '#F0C987',
  //       backgroundColor: '#F5F3E7',
  //       darkBackgroundColor: '#4C6A56',
  //       textColor: '#2F2F2F',
  //       navBackgroundColor: '#F5F3E7',
  //       navTextColor: '#33372C',
  //       navActiveBackground: '#33372C',
  //       navActiveText: '#ffffff',
  //       buttonColor: '#D9A064',
  //       buttonHoverColor: '#c9605b'
  //     };
  //     this.applyTheme();
  //   });
  // }



}
