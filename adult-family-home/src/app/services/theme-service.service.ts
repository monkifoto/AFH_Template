import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private firestore: AngularFirestore) {}

  // Default theme colors
  public defaultTheme = {
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

  // Fetch theme colors for a business. If not found, create a new document with default theme
getThemeColors(businessId: string): Observable<any> {
  console.log('Fetching theme for business ID:', businessId);

  const businessDocRef = this.firestore.collection('businesses').doc(businessId);
  const themeDocRef = businessDocRef.collection('theme').doc('themeDoc'); // Single theme doc for the business

  // Check if the business exists
  return businessDocRef.snapshotChanges().pipe(
    take(1), // Take the first value emitted to avoid issues with observable streams
    switchMap(businessSnapshot => {
      if (!businessSnapshot.payload.exists) {
        // If the business document doesn't exist, log an error and stop the process
        console.error('Business document does not exist');
        return throwError('Business document does not exist');
      }

      // Check if the theme document exists
      return themeDocRef.get().pipe(
        switchMap(docSnapshot => {
          if (docSnapshot.exists) {
            // If theme document exists, return its data
            return themeDocRef.valueChanges();
          } else {
            // If theme document does not exist, create a new one with default theme
            return from(themeDocRef.set(this.defaultTheme)).pipe(
              switchMap(() => {
                console.log('Created new theme for business with default values.');
                return themeDocRef.valueChanges(); // Return the newly created theme
              })
            );
          }
        })
      );
    }),
    catchError(error => {
      console.error('Error fetching theme:', error);
      return of(this.defaultTheme); // Return the default theme on error
    })
  );
}


updateColors(businessId: string, colors: any): Promise<void> {
  const themeDocRef = this.firestore.collection('businesses')
    .doc(businessId)
    .collection('theme')
    .doc('themeDoc'); // Directly reference the document by ID

  console.log("BusinessId: " + businessId + " theme service updateColors: ", colors);

  return themeDocRef.set(colors, { merge: true }) // Use 'merge: true' to avoid overwriting the entire document
    .then(() => {
      console.log('Colors updated successfully');
    })
    .catch(error => {
      console.error('Error updating colors:', error);
      throw new Error(error);
    });
}

  // Reset to default colors
  resetToDefaultColors(): Observable<any> {
    return this.firestore.collection('defaultSettings')
      .doc('colors')
      .valueChanges();
  }
}
