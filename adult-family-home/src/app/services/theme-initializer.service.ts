import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService {
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
}
