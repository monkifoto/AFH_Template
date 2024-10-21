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
  colors: any = {
    primaryColor: '#000000', // default primary color
    secondaryColor: '#ffffff', // default secondary color
    backgroundColor: '#f0f0f0', // default background color
    darkBackgroundColor: '#999999', // default background color
    textColor: '#333333' // default text color
  };

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
      this.loadThemeColors();
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
  loadThemeColors() {
    this.themeService.getThemeColors(this.businessId).subscribe((themeColors) => {
      console.log("Theme colors: ", themeColors);
      if (themeColors && this.hasValidColors(themeColors)) {
        this.colors = themeColors;

        this.applyTheme();
      } else {
        console.warn('No valid colors found in the database. Applying default theme.');
        // Fallback to default theme if no valid colors found
        this.themeService.resetToDefaultColors().subscribe((defaultColors) => {
          if (defaultColors && this.hasValidColors(defaultColors)) {
            this.colors = defaultColors;
          } else {
            // Use hardcoded defaults if all fails
            this.colors = {
              primaryColor: '#000000',
              secondaryColor: '#ffffff',
              backgroundColor: '#f0f0f0',
              textColor: '#333333',
            };
          }
          this.applyTheme();
        });
      }
    }, (error) => {
      console.error('Error fetching theme colors: ', error);
      // Apply default theme on error
      this.colors = {
        primaryColor: '#000000',
        secondaryColor: '#ffffff',
        backgroundColor: '#f0f0f0',
        darkBackgroundColor: '#999999',
        textColor: '#333333',
      };
      this.applyTheme();
    });
  }

  // Apply the theme colors to the document
  applyTheme() {
    if (!this.colors || !this.hasValidColors(this.colors)) {
      console.warn('Theme colors are not properly defined.');
      return;
    }

    document.documentElement.style.setProperty(
      '--primary-color', this.colors.primaryColor || '#000000'
    );
    document.documentElement.style.setProperty(
      '--secondary-color', this.colors.secondaryColor || '#ffffff'
    );
    document.documentElement.style.setProperty(
      '--background-color', this.colors.backgroundColor || '#f0f0f0'
    );
    document.documentElement.style.setProperty(
      '--dark-background-color', this.colors.darkBackgroundColor || '#999999'
    );
    document.documentElement.style.setProperty(
      '--text-color', this.colors.textColor || '#333333'
    );
  }

  // Validate if theme colors are complete
  hasValidColors(themeColors: any): boolean {
    return themeColors.primaryColor && themeColors.secondaryColor && themeColors.backgroundColor && themeColors.darkBackgroundColor && themeColors.textColor;
  }
}
