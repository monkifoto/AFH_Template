import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeLink: HTMLLinkElement;
  constructor(private firestore: AngularFirestore) {
    this.themeLink = document.createElement('link');
    this.themeLink.rel = 'stylesheet';
    document.head.appendChild(this.themeLink);
  }

  // Default theme colors
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
    return this.firestore
      .collection('businesses')
      .doc(businessId)
      .collection('theme')
      .doc('themeDoc')
      .valueChanges();
  }

  getThemeColors(businessId: string): Observable<any> {
    console.log('Theme Service: - Fetching theme for business ID:', businessId);

    const businessDocRef = this.firestore.collection('businesses').doc(businessId);
    const themeDocRef = businessDocRef.collection('theme').doc('themeDoc');

    return businessDocRef.snapshotChanges().pipe(
      take(1),
      switchMap(businessSnapshot => {
        if (!businessSnapshot.payload.exists) {
          console.error('Theme Service: - Business document does not exist!');
          return throwError('Theme Service: - Business document does not exist');
        }

        return themeDocRef.get().pipe(
          switchMap(docSnapshot => {
            if (docSnapshot.exists) {
              const themeData = docSnapshot.data();
              if (themeData?.['themeFileName']) {
               // this.applyThemeFile(themeData['themeFileName']);
              }
              return themeDocRef.valueChanges();
            } else {
              return from(themeDocRef.set(this.defaultTheme)).pipe(
                switchMap(() => {
                  console.log('Theme Service: - Created new theme with default values.');
                  this.applyThemeFile(this.defaultTheme.themeFileName);
                  return themeDocRef.valueChanges();
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
    const themeDocRef = this.firestore.collection('businesses')
      .doc(businessId)
      .collection('theme')
      .doc('themeDoc'); // Directly reference the document by ID

    console.log("Theme Service: - BusinessId: " + businessId + " theme service updateColors: ", colors);

    return themeDocRef.set(colors, { merge: true }) // Use 'merge: true' to avoid overwriting the entire document
      .then(() => {
        console.log('Theme Service: - Colors updated successfully');
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
    return this.firestore.collection('defaultSettings')
      .doc('colors')
      .valueChanges();
  }

  applyThemeFile(themeFileName: string): Promise<void> {
    const themePath = `assets/themes/${themeFileName}`; // Ensure this path is correct
    return this.loadCss(themePath);
  }

  private loadCss(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log('Load css from  file:',url);
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
