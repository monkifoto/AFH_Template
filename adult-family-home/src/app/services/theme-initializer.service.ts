import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService {
  constructor(private http: HttpClient,
    private themeService: ThemeService,
    private businessService: BusinessService
  ) {}

  loadTheme(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Fetch the theme filename directly from Firestore
      this.businessService.getThemeFileName('vfCMoPjAu2ROVBbKvk0D') // Replace with your business ID or logic
        .then(themeFileName => {
          // Apply the theme using ThemeService
          return this.themeService.applyThemeFile(themeFileName);
        })
        .then(() => resolve())
        .catch(() => resolve()); // Resolve even if it fails to avoid blocking app init
    });
  }
}
