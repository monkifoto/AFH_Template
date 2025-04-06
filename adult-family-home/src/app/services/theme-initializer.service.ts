import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';
import { Theme } from '../model/business-questions.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeInitializerService {
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
    private firestore: Firestore
  ) {}

  loadTheme(businessID: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const themeRef = doc(this.firestore, `businesses/${businessID}/theme/themeDoc`);
        const themeData = await firstValueFrom(docData(themeRef)) as Theme;

        const themeFileName = themeData?.themeFileName || 'default.css';
        await this.themeService.applyThemeFile(themeFileName);

        this.themeService.getThemeColors(businessID).subscribe({
          next: (themeColors) => {
            this.applyTheme(themeColors);
            resolve();
          },
          error: (err) => {
            console.error('Error loading theme colors:', err);
            resolve();
          }
        });
      } catch (error) {
        console.error('Error loading business theme:', error);
        this.themeService.applyThemeFile('default.css')
          .then(() => resolve())
          .catch(err => {
            console.error('Error applying default theme file:', err);
            resolve();
          });
      }
    });
  }

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
  }
}
