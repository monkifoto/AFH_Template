import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService {

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
    private http: HttpClient,
    private themeService: ThemeService,
    private businessService: BusinessService
  ) {}

  loadTheme(businessID: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Fetch the business theme
      this.themeService.getBusinessTheme(businessID).subscribe({
        next: (themeData) => {
          const themeFileName = themeData ? themeData.themeFileName : 'default.css';
          // Apply the theme and resolve the promise after applying it
          this.themeService.applyThemeFile(themeFileName)
            .then(() => resolve())
            .catch(error => {
              console.error('Error applying theme file:', error);
              resolve(); // Resolve even if there's an error to allow the app to load
            });

            this.themeService.getThemeColors(businessID).subscribe(
              (themeColors) => {
                this.applyTheme(themeColors);
                resolve();
              },
              (error) => {
                console.error('Error loading theme:', error);
                resolve();  // Resolve even on error to avoid blocking app load
              }
            );
        },
        error: (error) => {
          console.error('Error loading business theme:', error);
          this.themeService.applyThemeFile('default.css')
            .then(() => resolve())
            .catch(err => {
              console.error('Error applying default theme file:', err);
              resolve(); // Resolve even if there's an error
            });
        }
      });
    });
  }

   // Apply the theme colors to the document
   applyTheme(themeColors: any) {
    if (!this.colors || !this.hasValidColors(this.colors)) {
      console.warn('Theme colors are not properly defined.');
      return;
    }

    document.documentElement.style.setProperty('--primary-color', themeColors.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', themeColors.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', themeColors.accentColor);
    document.documentElement.style.setProperty('--background-color', themeColors.backgroundColor);
    document.documentElement.style.setProperty('--dark-background-color', themeColors.darkBackgroundColor);
    document.documentElement.style.setProperty('--text-color', themeColors.textColor);
    document.documentElement.style.setProperty('--nav-background-color', themeColors.navBackgroundColor);
    document.documentElement.style.setProperty('--nav-text-color', themeColors.navTextColor);
    document.documentElement.style.setProperty('--nav-active-background', themeColors.navActiveBackground);
    document.documentElement.style.setProperty('--nav-active-text', themeColors.navActiveText);
    document.documentElement.style.setProperty('--button-color', themeColors.buttonColor);
    document.documentElement.style.setProperty('--button-hover-color', themeColors.buttonHoverColor);
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
