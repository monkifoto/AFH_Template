import { Injectable } from '@angular/core';
import {
  Firestore, doc, getDoc, setDoc, collection,
  collectionData, docData, DocumentReference
} from '@angular/fire/firestore';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeLink: HTMLLinkElement;

  constructor(private firestore: Firestore) {
    this.themeLink = document.createElement('link');
    this.themeLink.rel = 'stylesheet';
    document.head.appendChild(this.themeLink);
  }

  public defaultTheme = {
    themeFileName: 'styles.css',
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

  getBusinessTheme(businessId: string): Observable<any> {
    const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`);
    return docData(themeRef);
  }

  getThemeColors(businessId: string): Observable<any> {
    const businessRef = doc(this.firestore, `businesses/${businessId}`);
    const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`);

    return from(getDoc(businessRef)).pipe(
      take(1),
      switchMap(businessSnap => {
        if (!businessSnap.exists()) {
          console.error('Theme Service: - Business document does not exist!');
          return throwError(() => new Error('Theme Service: - Business document does not exist'));
        }

        return from(getDoc(themeRef)).pipe(
          switchMap(themeSnap => {
            if (themeSnap.exists()) {
              const themeData = themeSnap.data();
              if (themeData?.['themeFileName']) {
                // this.applyThemeFile(themeData['themeFileName']);
              }
              return docData(themeRef);
            } else {
              return from(setDoc(themeRef, this.defaultTheme)).pipe(
                switchMap(() => {
                  this.applyThemeFile(this.defaultTheme.themeFileName);
                  return docData(themeRef);
                })
              );
            }
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching theme:', error);
        this.applyThemeFile(this.defaultTheme.themeFileName);
        return of(this.defaultTheme);
      })
    );
  }

  updateColors(businessId: string, colors: any): Promise<void> {
    const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`);
    return setDoc(themeRef, colors, { merge: true })
      .then(() => {
        if (colors.themeFileName) {
          this.applyThemeFile(colors.themeFileName);
        }
      })
      .catch(error => {
        console.error('Theme Service: - Error updating colors:', error);
        throw new Error(error);
      });
  }

  resetToDefaultColors(): Observable<any> {
    const defaultRef = doc(this.firestore, 'defaultSettings/colors');
    return docData(defaultRef);
  }

  applyThemeFile(themeFileName: string): Promise<void> {
    const themePath = `assets/themes/${themeFileName}`;
    return this.loadCss(themePath);
  }

  private loadCss(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      link.onload = () => {
        console.log(`Loaded theme: ${url}`);
        resolve();
      };
      link.onerror = (error) => {
        console.error(`Failed to load theme: ${url}`, error);
        reject(error);
      };

      document.head.appendChild(link);
    });
  }
}
