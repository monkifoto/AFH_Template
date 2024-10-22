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
    primaryColor: '#fffaf2', // default primary color
    secondaryColor: '#f8f3f0', // default secondary color
    accentColor: '#F0C987', // default accent color
    backgroundColor: '#F5F3E7', // default background color
    darkBackgroundColor: '#4C6A56', // default dark background color
    textColor: '#2F2F2F', // default text color
    navBackgroundColor: '#F5F3E7', // default nav background color
    navTextColor: '#33372C', // default nav text color
    navActiveBackground: '#33372C', // default nav active background color
    navActiveText: '#ffffff', // default nav active text color
    buttonColor: '#D9A064', // default button color
    buttonHoverColor: '#c9605b' // default button hover color
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
              primaryColor: '#fffaf2',
              secondaryColor: '#f8f3f0',
              accentColor: '#F0C987',
              backgroundColor: '#F5F3E7',
              darkBackgroundColor: '#4C6A56',
              textColor: '#2F2F2F',
              navBackgroundColor: '#F5F3E7',
              navTextColor: '#33372C',
              navActiveBackground: '#33372C',
              navActiveText: '#ffffff',
              buttonColor: '#D9A064',
              buttonHoverColor: '#c9605b'
            };
          }
          this.applyTheme();
        });
      }
    }, (error) => {
      console.error('Error fetching theme colors: ', error);
      // Apply default theme on error
      this.colors = {
        primaryColor: '#fffaf2',
        secondaryColor: '#f8f3f0',
        accentColor: '#F0C987',
        backgroundColor: '#F5F3E7',
        darkBackgroundColor: '#4C6A56',
        textColor: '#2F2F2F',
        navBackgroundColor: '#F5F3E7',
        navTextColor: '#33372C',
        navActiveBackground: '#33372C',
        navActiveText: '#ffffff',
        buttonColor: '#D9A064',
        buttonHoverColor: '#c9605b'
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

    document.documentElement.style.setProperty('--primary-color', this.colors.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', this.colors.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', this.colors.accentColor);
    document.documentElement.style.setProperty('--background-color', this.colors.backgroundColor);
    document.documentElement.style.setProperty('--dark-background-color', this.colors.darkBackgroundColor);
    document.documentElement.style.setProperty('--text-color', this.colors.textColor);
    document.documentElement.style.setProperty('--nav-background-color', this.colors.navBackgroundColor);
    document.documentElement.style.setProperty('--nav-text-color', this.colors.navTextColor);
    document.documentElement.style.setProperty('--nav-active-background', this.colors.navActiveBackground);
    document.documentElement.style.setProperty('--nav-active-text', this.colors.navActiveText);
    document.documentElement.style.setProperty('--button-color', this.colors.buttonColor);
    document.documentElement.style.setProperty('--button-hover-color', this.colors.buttonHoverColor);
  }

  // Validate if theme colors are complete
  hasValidColors(themeColors: any): boolean {
    return (
      themeColors.primaryColor &&
      themeColors.secondaryColor &&
      themeColors.accentColor &&
      themeColors.backgroundColor &&
      themeColors.darkBackgroundColor &&
      themeColors.textColor &&
      themeColors.navBackgroundColor &&
      themeColors.navTextColor &&
      themeColors.navActiveBackground &&
      themeColors.navActiveText &&
      themeColors.buttonColor &&
      themeColors.buttonHoverColor
    );
  }
}
