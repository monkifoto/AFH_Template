import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor(private firestore: AngularFirestore) {}

  getThemeColors(businessId: string): Observable<any> {
    console.log('getThemeColors: ', businessId);
    return this.firestore.collection('businesses')
      .doc(businessId)
      .collection('theme')
      .doc('5rg22HuZVOGJjppaVFMX')  // Replace with actual theme doc id
      .snapshotChanges()
      .pipe(
        map(action => action.payload.data())
      );
  }

  updateColors(businessId: string, colors: any): Promise<void> {
    return this.firestore.collection('businesses')
      .doc(businessId)
      .collection('theme')
      .doc('5rg22HuZVOGJjppaVFMX')  // Replace with actual theme doc id
      .set(colors);
  }

  resetToDefaultColors(): Observable<any> {
    return this.firestore.collection('defaultSettings')
      .doc('colors')
      .valueChanges();
  }
}
