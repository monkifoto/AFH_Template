import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  private isBrowser: boolean;

  colors: any = {
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

  constructor(
    private http: HttpClient,
    private themeService: ThemeService,
    private businessService: BusinessService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async loadTheme(businessID: string): Promise<void> {
    try {
      // Step 1: Get theme document
      const themeRef = doc(this.firestore, `businesses/${businessID}/theme/themeDoc`);
      const themeSnap = await getDoc(themeRef);
      const themeData = themeSnap.data();

      const themeFileName = themeData?.['themeFileName'] || 'default.css';

      // Step 2: Apply theme CSS file
      await this.themeService.applyThemeFile(themeFileName);

      // Step 3: Apply theme colors (browser-only)
      if (this.isBrowser) {
        this.themeService.getThemeColors(businessID).subscribe({
          next: (themeColors) => this.applyTheme(themeColors),
          error: (err) => console.error('Error loading theme colors:', err),
        });
      }
    } catch (error) {
      console.error('Error loading business theme:', error);
      await this.themeService.applyThemeFile('default.css');
    }
  }

  applyTheme(themeColors: any) {
    if (!this.colors || !this.hasValidColors(themeColors)) {
      console.warn('Theme colors are not properly defined.');
      return;
    }

    if (this.isBrowser) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', themeColors.primaryColor);
      root.style.setProperty('--secondary-color', themeColors.secondaryColor);
      root.style.setProperty('--accent-color', themeColors.accentColor);
      root.style.setProperty('--background-color', themeColors.backgroundColor);
      root.style.setProperty('--dark-background-color', themeColors.darkBackgroundColor);
      root.style.setProperty('--text-color', themeColors.textColor);
      root.style.setProperty('--nav-background-color', themeColors.navBackgroundColor);
      root.style.setProperty('--nav-text-color', themeColors.navTextColor);
      root.style.setProperty('--nav-active-background', themeColors.navActiveBackground);
      root.style.setProperty('--nav-active-text', themeColors.navActiveText);
      root.style.setProperty('--button-color', themeColors.buttonColor);
      root.style.setProperty('--button-hover-color', themeColors.buttonHoverColor);
    } else {
      console.log('⛔ Skipping CSS variable injection on server.');
    }
  }

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
