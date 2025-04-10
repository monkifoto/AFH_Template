<<<<<<< HEAD
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ThemeInitializerService {
  private firestore = getFirestore(
    getApps().length ? getApps()[0] : initializeApp(environment.firebase)
  );

  private isBrowser: boolean;
=======
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Theme } from '../model/business-questions.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService {
  firestore = getFirestore(initializeApp(environment.firebase));

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
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4

  constructor(
    private http: HttpClient,
    private themeService: ThemeService,
    private businessService: BusinessService,
<<<<<<< HEAD
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async loadTheme(businessID: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('⛔ Skipping theme load on server');
      return;
    }
    try {
      const themeRef = doc(this.firestore, `businesses/${businessID}/theme/themeDoc`);
      const themeSnap = await getDoc(themeRef);

      const themeData = themeSnap.exists() ? themeSnap.data() : null;
      const themeFileName = themeData?.['themeFileName'] || 'default.css';

      await this.themeService.applyThemeFile(themeFileName);

      if (this.isBrowser) {
        this.themeService.getThemeColors(businessID).subscribe({
          next: (themeColors) => this.applyTheme(themeColors),
          error: (err) => console.error('Error loading theme colors:', err),
        });
      }
=======
  ) {}

  async loadTheme(businessID: string): Promise<void> {
    try {
      // Step 1: Get theme document
      const themeRef = doc(this.firestore, `businesses/${businessID}/theme/themeDoc`);
      const themeSnap = await getDoc(themeRef);
      const themeData = themeSnap.data();

      const themeFileName = themeData?.['themeFileName'] || 'default.css';

      // Step 2: Apply theme CSS file
      await this.themeService.applyThemeFile(themeFileName);

      // Step 3: Apply theme colors (optional - if this still uses AngularFire, make sure it's safe)
      this.themeService.getThemeColors(businessID).subscribe({
        next: (themeColors) => this.applyTheme(themeColors),
        error: (err) => console.error('Error loading theme colors:', err),
      });
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
    } catch (error) {
      console.error('Error loading business theme:', error);
      await this.themeService.applyThemeFile('default.css');
    }
  }

<<<<<<< HEAD
  applyTheme(themeColors: any): void {
    if (!this.isBrowser || !this.hasValidColors(themeColors)) {
      console.warn('Skipping theme application. Invalid data or not in browser.');
      return;
    }

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
  }

  private hasValidColors(themeColors: any): boolean {
    const keys = [
      'primaryColor',
      'secondaryColor',
      'accentColor',
      'backgroundColor',
      'darkBackgroundColor',
      'textColor',
      'navBackgroundColor',
      'navTextColor',
      'navActiveBackground',
      'navActiveText',
      'buttonColor',
      'buttonHoverColor',
    ];
    return keys.every((key) => themeColors?.[key]);
=======
  // async loadTheme(businessID: string): Promise<void> {
  //   try {
  //     const themeRef = doc(this.firestore, `businesses/${businessID}/theme/themeDoc`);
  //     const themeSnap = await getDoc(themeRef);
  //     const themeData = themeSnap.data();

  //     console.log('✅ MOCK (modular SDK) theme data loaded:', themeData);
  //   } catch (error) {
  //     console.error('❌ MOCK (modular SDK) theme load failed:', error);
  //   }
  // }

  applyTheme(themeColors: any) {
    if (!this.colors || !this.hasValidColors(themeColors)) {
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
>>>>>>> 83fb2715cd57eca82a0c70109b053b42859ddbd4
  }
}
