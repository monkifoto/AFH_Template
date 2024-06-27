import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Business } from '../model/business-questions.model';

@Injectable({
  providedIn: 'root'
})
export class WebContentService {
  private defaultBusinessId = 'vfCMoPjAu2ROVBbKvk0D';
  constructor(private firestore: AngularFirestore) { }

  // getBusinessData(id:string): Observable<any> {
  //   console.log('WebContent Service call');
  //   return this.firestore.collection('business').doc(id).valueChanges();
  // }

  // getBusinessData(id:string): Observable<Business | undefined> {
  //   return this.firestore.collection('business').doc<Business>(id).valueChanges();
  // }
  getBusinessData(id:string): Observable<Business | undefined> {
    if (id == null || id == undefined || id == ''){
      id = this.defaultBusinessId;
    }
    console.log(`Fetching business data for ID: ${id}`);
    return this.firestore.collection('businesses').doc<Business>(id).snapshotChanges().pipe(
      map((action: { payload: { data: () => any; id: any; }; }) => {
        const data = action.payload.data();
        if (data) {
          const id = action.payload.id;
          return { id, ...data } as Business;
        } else {
          console.error('No data found for the given ID');
          return undefined;
        }
      })
    );

  }

  getDefaultBusinessData(): Observable<Business | undefined> {
    return this.getBusinessData(this.defaultBusinessId);
  }
}
